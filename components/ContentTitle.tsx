const Title = ({ children }) => {
  return (
    <div className="title">
      {children}
      <style jsx>{`
        .title {
          margin: 0.5em 0 1em 0;
          font-size: 2em;
        }
      `}</style>
    </div>
  )
}

export default Title
