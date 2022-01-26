import React from "react";
import { render } from "react-dom";
import { map } from 'ramda';

//JSX.Element -> JSX.Element
const uppercase = (element: JSX.Element) => (
  <span style={{ textTransform: 'uppercase' }}>{element}</span>
)

//JSX.Element -> JSX.Element
const clap = (element: JSX.Element) => (
  <span>👏 {element} 👏</span>
)

//JSX.Element -> JSX.Element
const emphasize = (element: JSX.Element) => (
  <span style={{ fontStyle: 'italic' }}>{element}</span>
)

//{ name: string } ->  JSX.Element
const Greeting = ({ name }: { name: string }) => <span>Hello {name}!</span>

function contrivedEx(name) {
  const a = Greeting({ name })
  const b = uppercase(a)
  const c = emphasize(b)
  const d = clap(c)
  return d
}

//First naive render
//render(contrivedEx('Homer'), document.getElementById('root'));

const View = computation => ({
  fold: computation,

  map: f =>
    View(props => f(computation(props))),

  contramap: g =>
    View(props => computation(g(props))),

  concat: other =>
    View(props => (
      <React.Fragment>
        {computation(props)}
        {other.fold(props)}
      </React.Fragment>
    ))
})

View.of = x => View(() => x);

const greeting = View(({ name }) => <span>Hello {name}!</span>)

const superGreeting = greeting
  .map(uppercase)
  .map(emphasize)
  .map(clap)

//Render via View monad with fold () and map (Functor) 
//render(superGreeting.fold({ name: 'Homer' }), document.getElementById('root'));


//--------HOC----------

const color = View(({ color }) => (
  <span style={{ color }}>{color}</span>
))

const blue = color.contramap((props) => ({ ...props, color: 'blue' }))

const header = View.of(<h1>Hello HOC</h1>)
const footer = View.of(<p>© dx 2021</p>)

const main = header.map(x => <header style={{ color: 'red' }}>{x}</header>)
  .concat(greeting.contramap(() => ({ name: 'Homer' })))
  .concat(footer.map(x => <footer style={{ color: 'blue' }}>{x}</footer>))

const centered = main.map(
  x => <div style={{ textAlign: 'center' }}>{x}</div>)

//Render HOC on View as semigroup (have concat)
//render(centered.fold(), document.getElementById('root'));

// Normal React HOC
// const red = Component => () => <span style={{ color: 'red' }}><Component/></span>
// const red2 = view => view.map(x => <span style={{ color: 'red' }}>{x}</span>)

// render(red(greeting.fold({name: 'Alice'}) as JSX.Element), document.getElementById('root'));


//Adding Empty making View Monoid 
//in addition to Functor, Contravariant, Semigroup
View.empty = View.of(null);

const copyrightNotice = View(({ author, year }) => (
  <p>(c) {author} {year}</p>
))

const Reader = computation => ({
  run: context => computation(context),
  map: f => Reader(context => f(computation(context))),
  ap: other => Reader(context => {
    const fn = computation(context);
    return fn(other.run(context));
  }),
  chain: f => {
    return Reader(context => {
      const a = computation(context);
      return f(a).run(context);
    })
  }
})

Reader.of = x => Reader(() => x);

const footerReader = Reader(({ author, year }) => View(() => (
  <p>(c) {author} {year}</p>
)));
//Or easier via contramap
// const footerReader = Reader(({ author, year }) =>
//   copyrightNotice.contramap(() => ({ author, year })));

//render(footerReader.run({year: 2022, author: 'Homer'}).fold(), document.getElementById('root'));


const footerReader2 = footerReader.map(map(y => <footer>{y}</footer>));

//render(footerReader2.run({year: 2022, author: 'Homer'}).fold(), document.getElementById('root'));

const makeColor = ({ color }) => view => view.map(element => <div style={{ color }}>{element}</div>)

const withColor = Reader(makeColor);

const colorize = withColor.run({ color: 'red' });

const footerView = footerReader2.run({ year: 2022, author: 'Homer' });

//const result = colorize(footerView);
//render(result.fold(), document.getElementById('root'));

//After Rуader become Applicative

const footerWithColorReader = withColor.ap(footerReader2);

const viewToRender
  = footerWithColorReader.run({ year: 2022, author: 'Homer', color: 'red' });


// render(viewToRender.fold(), document.getElementById('root'));

const pageTitle = View(({ title }) => <h1>{title}</h1>);

const headerChained =
  Reader(({ title }) => pageTitle.contramap(() => ({ title })))
    .map(map(x => <header>{x}</header>));

const combined = headerChained.map(headerView => (
  footerReader2.map(footerView => (
    headerView.concat(footerView)
  ))
));

const context = {
  year: 2022, author: 'Homer', title: 'Hello'
}

//render(combined.run(context).run(context).fold(), document.getElementById('root'));

//use with CHAIN
const addFooter = other => (
  footerReader2.map(footerView => (
    other.concat(footerView)
  ))
)

const combined2 = headerChained.chain(addFooter);

render(combined2.run(context).fold(), document.getElementById('root'));