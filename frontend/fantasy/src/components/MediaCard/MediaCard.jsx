import './MediaCard.css'

const MediaCard = ({key, path, title, tags =[], onClick})=> {
    return(
        <button className='media-card' key={key} onClick={onClick}>
            <img src={path} alt={title} />

            <div className='media-card-overlay'>
                <div className='media-card-content'>
                    <h4> {title} </h4>

                    <div className='media-card-tags'>
                        {tags.map(tag=> (
                            <span key={tag} className='media-card-tag'>
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </button>
    )
}

export default MediaCard
