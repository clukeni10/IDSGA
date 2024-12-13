import { PersonType } from "../types/PersonType"
import IndexedDB from "./IndexedDB"
import { objectStore } from "./IndexedDB/objectStore"

export default class PersonDao {
    
    static shared = new PersonDao()
	private keyPath = objectStore.personObjectStore

	async addPerson(person: PersonType): Promise<void> {
		await IndexedDB.shared.addItem<PersonType>(person, this.keyPath)
	}

	async deletePerson(id: string) {
		await IndexedDB.shared.removeItem(id, this.keyPath)
	}

	async updatePerson(persons: PersonType | PersonType[]): Promise<void> {

		if (Array.isArray(persons)) {
			for (const person of persons) {
				await IndexedDB.shared.editItem<PersonType>(person, this.keyPath)
			}
		} else {
			await IndexedDB.shared.editItem<PersonType>(persons, this.keyPath)
		}
	}

	async getAllPersons(): Promise<PersonType[]> {
		return await IndexedDB.shared.loadData<PersonType>(this.keyPath)
	}
}