export interface ISale {
    id: number,
    obs: string | null,
    fincash_id: number,
    created_at: Date,
    updated_at: Date,
    deleted_at?: Date,
    cancel_reason?: string,
}