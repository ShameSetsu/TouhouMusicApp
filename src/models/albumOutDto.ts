import { AlbumTrackOutDto } from './trackOutDto';

export type AlbumOutDto = {
    _id: string,
    name: string,
    artist: {
        _id: string,
        name: string
    },
    thumbnail: string,
    duration: number,
    event: {
        _id: string,
        name: string
    },
    nbTracks: number,
    release: string,
    website?: string,
    tracks: Array<AlbumTrackOutDto>
}