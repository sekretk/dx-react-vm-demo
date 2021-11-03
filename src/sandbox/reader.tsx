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