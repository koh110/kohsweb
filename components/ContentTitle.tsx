const Title = ({ children }) => {
  return (
    <div className="title">
      {children}
      <style jsx>{`
        .title {
          font-size: 1.5em;
          padding: 0 1rem;
        }
      `}</style>
    </div>
  )
}

export default Title
