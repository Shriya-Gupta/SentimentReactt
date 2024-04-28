import React from 'react'
import SongList from './SongList'
import love from "./love.json"

export default function Songs() {
    return (
        <>
            <h2>Feeling Loved : Here are some songs</h2>
            {love.map((ele) => {
                return <SongList title={ele.title} singer={ele.singer} emotion={ele.emotion} />
            })}

        </>
    )
}
