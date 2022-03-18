const Title = ({ children }) => {
  return (
    <div className="title">
      {children}
      <style jsx>{`
        .title {
          padding: 0 0.5em;
          font-size: 1.5em;
        }
      `}</style>
    </div>
  )
}

export default Title
