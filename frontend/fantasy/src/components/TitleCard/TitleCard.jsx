import './TitleCard.css'

const TitleCard =  ({title})=>{
    return (
        <div className='title-card'>
            <span className='title-accent'> </span>
              <h1> {title} </h1>

        </div>
    )
}

export default TitleCard