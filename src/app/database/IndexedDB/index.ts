import { openIndexedDB } from "./IndexedDBStore"

export default class IndexedDB {

    public databaseName: string = "sga-app-data"
    public version: number = 1
    static shared = new IndexedDB()

    private accumulatedResults: any[] = []

    async addItem<T>(items: T[] | T, keyPath: string) {
        try {
            const arrayItems = Array.isArray(items) ? items : [items]
            const { store } = await (openIndexedDB(this.databaseName, keyPath, "readwrite", this.version))

            for (const item of arrayItems) {
                await store.add(item)
            }

        } catch (error) {
            console.error("Erro ao adicionar dados:", error)
        }
    }

    getData<T>(id: string, keyPath: string): Promise<T> {
        return new Promise(async (resolve, reject) => {
            try {
                const { store } = await (openIndexedDB(this.databaseName, keyPath, "readonly", this.version))
                const request = store.get(id)

                request.onsuccess = (event) => {
                    const rawData = (
                        event.target as IDBRequest<T>
                    ).result
                    resolve(rawData)
                }

                request.onerror = (event) => {
                    reject((event.target as IDBRequest).error)
                }

            } catch (error) {
                console.error("Erro ao abrir o banco de dados:", error)
                reject(error)
            }
        })
    }

    loadDataWithCursor<T>(keyPath: string, indexName: string, offset: number, limit: number, idbKey: IDBValidKey): Promise<[T[], IDBCursorWithValue | null]> {
        return new Promise(async (resolve, reject) => {
            try {
                let count = 0
                let request: IDBRequest
                let indexData: IDBIndex
                const { store } = await (openIndexedDB(this.databaseName, keyPath, "readonly", this.version))

                indexData = store.index(indexName)
                request = indexData.openCursor(idbKey, 'next')

                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result

                    if (cursor && count < limit + offset) {
                        if (count >= offset) {
                            this.accumulatedResults.push(cursor.value)
                        }
                        count++
                        cursor.continue()
                    } else {
                        resolve([this.accumulatedResults, cursor])
                    }
                }

                request.onerror = (event) => {
                    reject((event.target as IDBRequest).error)
                }

            } catch (error) {
                console.error("Erro ao abrir o banco de dados:", error)
                reject(error)
            }
        })
    }

    loadData<T>(keyPath: string, indexName?: string): Promise<T[]> {
        return new Promise(async (resolve, reject) => {
            try {

                const { store } = await (openIndexedDB(this.databaseName, keyPath, "readonly", this.version))
                let cursorRequest: IDBRequest<IDBCursorWithValue | null>

                if (indexName) {
                    const indexData = store.index(indexName)
                    cursorRequest = indexData.openCursor()
                } else {
                    cursorRequest = store.openCursor()
                }

                const allData: T[] = [];

                cursorRequest.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
                    if (cursor) {
                        allData.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(allData);
                    }
                };

                cursorRequest.onerror = () => {
                    reject('Erro ao buscar os dados');
                };

            } catch (error) {
                console.error("Erro ao abrir o banco de dados:", error)
                reject(error)
            }
        })
    }

    loadDataBySpecificIndex<T>(keyPath: string, indexName: string, id?: string): Promise<T[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const { store } = await openIndexedDB(this.databaseName, keyPath, "readonly", this.version);

                const indexData = store.index(indexName);
                const query = id ? indexData.openCursor(id) : indexData.openCursor()
                const allData: T[] = [];
                
                query.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue | null>).result;
                    if (cursor) {
                        allData.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(allData);
                    }
                };

                query.onerror = (event) => {
                    reject((event.target as IDBRequest).error);
                };

            } catch (error) {
                console.error("Erro ao abrir o banco de dados:", error);
                reject(error);
            }
        })
    }

    /* loadDataBySpecificIndexWithRange<T>(keyPath: string, indexName: string, filter: FilterDateType): Promise<T[]> {
        return new Promise(async (resolve, reject) => {
            try {
                const { store } = await openIndexedDB(this.databaseName, keyPath, "readonly", this.version);

                const indexData = store.index(indexName);
                const results: T[] = [];

                const cursorRequest = indexData.openCursor();

                cursorRequest.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

                    if (cursor) {
                        const record = cursor.value;

                        const data = getInvoicesByDate(filter.firstDate, filter.lastDate, record)

                        if (data) {
                            results.push(record as T);
                        }

                        cursor.continue();
                    } else {
                        resolve(results);
                    }
                };

                cursorRequest.onerror = (event) => {
                    reject((event.target as IDBRequest).error);
                };

            } catch (error) {
                console.error("Erro ao abrir o banco de dados:", error);
                reject(error);
            }
        });
    }

    loadDataOnSearch<T>(keyPath: string, indexName: string, filter: string | FilterInvoiceNumberType): Promise<T> {
        return new Promise(async (resolve, reject) => {
            try {
                const { store } = await openIndexedDB(this.databaseName, keyPath, "readonly", this.version);
                const indexData = store.index(indexName);
                const results: T[] = [];
                let keyRange: IDBKeyRange

                if (typeof filter === 'string') {
                    keyRange = IDBKeyRange.bound(filter, filter + '\uffff');
                } else {
                    keyRange = IDBKeyRange.bound(filter.from, filter.to, false, false);
                }

                const request = indexData.openCursor(keyRange);

                request.onsuccess = (event) => {
                    const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
                    if (cursor) {
                        results.push(cursor.value);
                        cursor.continue();
                    } else {
                        resolve(results[0]);
                    }
                };

                request.onerror = (event) => {
                    reject((event.target as IDBRequest).error);
                };

            } catch (error) {
                console.error("Erro ao abrir o banco de dados:", error);
                reject(error);
            }
        })
    } */

    async editItem<T>(updatedItem: T, keyPath: string) {
        try {
            const { store } = await (openIndexedDB(this.databaseName, keyPath, "readwrite", this.version))
            return store.put(updatedItem)
        } catch (error) {
            console.error("Erro ao editar dados:", error)
        }
    }

    bulkAddItems<T>(updatedItems: T[], keyPath: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const { store, trx } = await (openIndexedDB(this.databaseName, keyPath, "readwrite", this.version))

            updatedItems.forEach((item) => {
                const request = store.add(item)

                request.onsuccess = function () {
                    console.log(`Item with id inserted successfully.`);
                };

                request.onerror = function (_) {
                    console.error(`Error Adding item with id:`);
                };
            })

            trx.oncomplete = function () {
                console.log('Transaction completed.');
                resolve();
            };

            trx.onerror = function (event) {
                reject((event.target  as IDBRequest<IDBCursorWithValue>).error);
            };
        })
    }

    bulkUpdateItems<T>(updatedItems: T[], keyPath: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const { store, trx } = await (openIndexedDB(this.databaseName, keyPath, "readwrite", this.version))

            updatedItems.forEach((item) => {
                const request = store.put(item)

                request.onsuccess = function () {
                    console.log(`Item with id updated/inserted successfully.`);
                };

                request.onerror = function (_) {
                    console.error(`Error updating item with id:`);
                };
            })

            trx.oncomplete = function () {
                console.log('Transaction completed.');
                resolve();
            };

            trx.onerror = function (event) {
                reject((event.target  as IDBRequest<IDBCursorWithValue>).error);
            };
        })
    }

    bulkDeleteItems(itemsId: string[], keyPath: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const { store, trx } = await (openIndexedDB(this.databaseName, keyPath, "readwrite", this.version))

            itemsId.forEach((item) => {
                const request = store.delete(item)

                request.onsuccess = function () {
                    console.log(`Item with id deleted successfully.`);
                };

                request.onerror = function (_) {
                    console.error(`Error delete item with id:`);
                };
            })

            trx.oncomplete = function () {
                console.log('Transaction completed.');
                resolve();
            };

            trx.onerror = function (event) {
                reject((event.target  as IDBRequest<IDBCursorWithValue>).error);
            };
        })
    }

    async removeItem(id: string | number, keyPath: string) {
        try {
            const { store } = await (openIndexedDB(this.databaseName, keyPath, "readwrite", this.version))
            return await store.delete(id)
        } catch (error) {
            console.error("Erro ao excluir dados:", error)
        }
    }

    async clearData(keyPath: string) {
        try {
            const { store } = await (openIndexedDB(this.databaseName, keyPath, "readwrite", this.version))
            await store.clear()
        } catch (error) {
            console.error("Erro ao limpar dados:", error)
        }
    }

    resetAccumulatedResults() {
        this.accumulatedResults = []
    }
}
