const Title = ({ children }) => {
  return (
    <div className="title">
      {children}
      <style jsx>{`
        .title {
          font-size: 1.5em;
        }
      `}</style>
    </div>
  )
}

export default Title
