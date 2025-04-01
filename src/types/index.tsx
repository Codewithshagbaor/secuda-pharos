export interface Document {
    name: string
    date: string
    type: string
    size: string
    status: string
}

export enum DocumentStatus { Minted, NotMinted }