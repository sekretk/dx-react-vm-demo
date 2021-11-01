import React from "react";
import { render } from "react-dom";

const uppercase = element => (
    <span style={{ textTransform: 'uppercase' }}>{element}</span>
  )
  
  const clap = element => (
    <span>👏 {element} 👏</span>
  )
  
  const emphasize = element => (
    <span style={{ fontStyle: 'italic' }}>{element}</span>
  )

  const Greeting = ({ name }) => <span>Hello {name}!</span>

  function contrivedEx(name) {
    const a = Greeting({ name })
    const b = uppercase(a)
    const c = emphasize(b)
    const d = clap(c)
    return d
  }

  const View = computation => ({
    // I've shortened this since `props => computation(props)` is the same as `computation`
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

  const color = View(({ color }) => (
    <span style={{ color }}>{color}</span>
  ))

  const blue = color.contramap((props) => ({ ...props, color: 'blue' }))

  const header = View.of(<h1>Awesome App</h1>)
  //const greeting = View(({ name }) => <p>Hello {name}!</p>)
  const footer = View.of(<p>© Bob McBob 2017</p>)
  
  const main = header.map(x => <header style={{ color: 'red' }}>{x}</header>)
    .concat(greeting.contramap(() => ({ name: 'Alice' })))
    .concat(footer.map(x => <footer style={{ color: 'blue' }}>{x}</footer>))
  
  const centered = main.map(x => <div style={{ textAlign: 'center' }}>{x}</div>)


render(centered.fold(), document.getElementById('root'));

// Normal React HOC
// const red = Component => () => <span style={{ color: 'red' }}><Component/></span>
// const red2 = view => view.map(x => <span style={{ color: 'red' }}>{x}</span>)

// render(red(greeting.fold({name: 'Alice'}) as JSX.Element), document.getElementById('root'));