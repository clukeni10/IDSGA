import { v4 as uuidv4 } from 'uuid';

export default class UUIDv4 {
    
    static generateId() {
        return uuidv4()
    }
}