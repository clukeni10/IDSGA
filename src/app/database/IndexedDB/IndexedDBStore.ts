/**
 * Abre ou cria um banco de dados IndexedDB e retorna um objeto de loja de objetos.
 *
 * @param {string} databaseName - O nome do banco de dados.
 * @param {string} keyPath - A chave primária para a loja de objetos.
 * @param {'readonly' | 'readwrite'} option - A opção de transação ('readonly' para leitura, 'readwrite' para leitura e gravação).
 * @param {number} version - A versão do banco de dados.
 *
 * @returns {Promise<IDBObjectStore>} - Uma Promise que resolve com o objeto de loja de objetos.
 */

import { objectStore } from "./objectStore";


export const openIndexedDB = (databaseName: string, keyPath: string, option: "readonly" | "readwrite", version: number): Promise<{ store: IDBObjectStore; trx: IDBTransaction }> => {
    return new Promise<{ store: IDBObjectStore; trx: IDBTransaction }>((resolve, reject) => {
        let db: IDBDatabase
        const request = window.indexedDB.open(databaseName, version);

        request.onupgradeneeded = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            onUpgradeNeeded(db)
            //onUpgradeNeededIndexes(db, request)
        };

        request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            try {
                const trx = db.transaction([keyPath], option);
                const store = trx.objectStore(keyPath);
                resolve({ store, trx });
            } catch (error) {
                let message = 'Erro desconhecido!';
                if (error instanceof Error) message = error.message;
                reject(message);
            }
        };

        request.onerror = (event) => {
            reject((event.target as IDBOpenDBRequest).error);
        };
    });
};

export async function createDatabase(version: number) {
    let db: IDBDatabase
    const databaseName = "sga-app-data"
    const request = window.indexedDB.open(databaseName, version);

    request.onupgradeneeded = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        onUpgradeNeeded(db)
        //onUpgradeNeededIndexes(db, request)
    };

    request.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        onUpgradeNeeded(db)
        //onUpgradeNeededIndexes(db, request)
    };

    request.onerror = (event) => {
        console.error((event.target as IDBOpenDBRequest).error);
    };
}


function onUpgradeNeeded(db: IDBDatabase) {
    if (!db.objectStoreNames.contains(objectStore.cardObjectStore)) {
        db.createObjectStore(objectStore.cardObjectStore, { keyPath: "cardNumber" });
    }
    if (!db.objectStoreNames.contains(objectStore.personObjectStore)) {
        db.createObjectStore(objectStore.personObjectStore, { keyPath: "id" });
    }
}

/* function onUpgradeNeededIndexes(db: IDBDatabase, request: IDBOpenDBRequest) {
    if (db.objectStoreNames.contains(objectStore.itemsObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.itemsObjectStore);

        if (store && !store.indexNames.contains(indexObjectStore.itemNameIndex)) {
            store.createIndex(indexObjectStore.itemNameIndex, 'itemName');
        }
        if (store && !store.indexNames.contains(indexObjectStore.itemAvailableIndex)) {
            store.createIndex(indexObjectStore.itemAvailableIndex, 'itemAvailable');
        }
        if (store && !store.indexNames.contains(indexObjectStore.priceIndex)) {
            store.createIndex(indexObjectStore.priceIndex, 'itemPriceDefault');
        }
        if (store && !store.indexNames.contains(indexObjectStore.itemCategoryIdIndex)) {
            store.createIndex(indexObjectStore.itemCategoryIdIndex, 'itemCategory.id', { unique: false });
        }
        if (store && !store.indexNames.contains(indexObjectStore.itemCategoryGroupIndex)) {
            store.createIndex(indexObjectStore.itemCategoryGroupIndex, 'itemCategory.group', { unique: false });
        }
        if (store && !store.indexNames.contains(indexObjectStore.itemIngredientIdIndex)) {
            store.createIndex(indexObjectStore.itemIngredientIdIndex, 'ingredientsId', { unique: false, multiEntry: true });
        }
    }

    if (db.objectStoreNames.contains(objectStore.categoriesObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.categoriesObjectStore);

        if (store && !store.indexNames.contains(indexObjectStore.categoryNameIndex)) {
            store.createIndex(indexObjectStore.categoryNameIndex, 'categoryName');
        }
        if (store && !store.indexNames.contains(indexObjectStore.categoryPositionIndex)) {
            store.createIndex(indexObjectStore.categoryPositionIndex, 'menuPosition');
        }
        if (store && !store.indexNames.contains(indexObjectStore.categoryGroupIndex)) {
            store.createIndex(indexObjectStore.categoryGroupIndex, 'group');
        }
    }

    if (db.objectStoreNames.contains(objectStore.tablesObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.tablesObjectStore);

        if (store && !store.indexNames.contains(indexObjectStore.tableNameIndex)) {
            store.createIndex(indexObjectStore.tableNameIndex, 'tableName');
        }
    }

    if (db.objectStoreNames.contains(objectStore.warehousesObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.warehousesObjectStore);

        if (store && !store.indexNames.contains('itemNameIndex')) {
            store.createIndex('itemNameIndex', 'itemName');
        }
    }

    if (db.objectStoreNames.contains(objectStore.suppliersObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.suppliersObjectStore);

        if (store && !store.indexNames.contains('supplierIndex')) {
            store.createIndex('supplierIndex', 'supplier');
        }
    }

    if (db.objectStoreNames.contains(objectStore.invoicesObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.invoicesObjectStore);

        if (store && !store.indexNames.contains('invoiceNumberIndex')) {
            store.createIndex(indexObjectStore.invoiceNumberIndex, 'invoiceNumber');
        }
        if (store && !store.indexNames.contains('createdAtIndex')) {
            store.createIndex(indexObjectStore.createdAtIndex, 'createdAt');
        }
        if (store && !store.indexNames.contains('yearIndex')) {
            store.createIndex(indexObjectStore.yearIndex, 'year');
        }
        if (store && !store.indexNames.contains('invoiceSequenceNumberIndex')) {
            store.createIndex(indexObjectStore.invoiceSequenceNumberIndex, 'invoiceSequenceNumber');
        }
        if (store && !store.indexNames.contains('invoiceOrderCustomerIndex')) {
            store.createIndex(indexObjectStore.invoiceOrderCustomerIndex, 'order.customer.nif');
        }
    }

    if (db.objectStoreNames.contains(objectStore.creditNotesObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.creditNotesObjectStore);

        if (store && !store.indexNames.contains('creditNoteNumberIndex')) {
            store.createIndex('creditNoteNumberIndex', 'id');
        }
        if (store && !store.indexNames.contains('createdAtIndex')) {
            store.createIndex('createdAtIndex', 'createdAt');
        }
    }

    if (db.objectStoreNames.contains(objectStore.customersObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.customersObjectStore);

        if (store && !store.indexNames.contains(indexObjectStore.nameIndex)) {
            store.createIndex(indexObjectStore.nameIndex, 'name');
        }
    }

    if (db.objectStoreNames.contains(objectStore.consumerCardsObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.consumerCardsObjectStore);

        if (store && !store.indexNames.contains('cardIdIndex')) {
            store.createIndex(indexObjectStore.cardIdIndex, 'cardId');
        }
        if (store && !store.indexNames.contains('createdAtIndex')) {
            store.createIndex(indexObjectStore.createdAtIndex, 'createdAt');
        }
        if (store && !store.indexNames.contains('balanceIndex')) {
            store.createIndex(indexObjectStore.balanceIndex, 'balance');
        }
    }

    if (db.objectStoreNames.contains(objectStore.consumerCardTransactionsObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.consumerCardTransactionsObjectStore);

        if (store && !store.indexNames.contains('createdAtIndex')) {
            store.createIndex('createdAtIndex', 'createdAt');
        }
    }

    if (db.objectStoreNames.contains(objectStore.warehousesTransactionsInputObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.warehousesTransactionsInputObjectStore);

        if (store && !store.indexNames.contains('createdAtIndex')) {
            store.createIndex('createdAtIndex', 'orderDateAdd');
        }
    }

    if (db.objectStoreNames.contains(objectStore.warehousesTransactionsOutputObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.warehousesTransactionsOutputObjectStore);

        if (store && !store.indexNames.contains('createdAtIndex')) {
            store.createIndex('createdAtIndex', 'orderDateAdd');
        }
    }

    if (db.objectStoreNames.contains(objectStore.feeRegulatorObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.feeRegulatorObjectStore);

        if (store && !store.indexNames.contains('lastInvoiceNumberIndex')) {
            store.createIndex('lastInvoiceNumberIndex', 'lastInvoiceNumber');
        }
        if (store && !store.indexNames.contains('createdAtIndex')) {
            store.createIndex('createdAtIndex', 'createdAt');
        }
    }

    if (db.objectStoreNames.contains(objectStore.licensesHistoryObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.licensesHistoryObjectStore);

        if (store && !store.indexNames.contains(indexObjectStore.activationDateIndex)) {
            store.createIndex(indexObjectStore.activationDateIndex, 'activationDate');
        }
    }

    if (db.objectStoreNames.contains(objectStore.ingredientObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.ingredientObjectStore);

        if (store && !store.indexNames.contains('ingredientNameIndex')) {
            store.createIndex('ingredientNameIndex', 'ingredientName');
        }
        if (store && !store.indexNames.contains('inUseIndex')) {
            store.createIndex('inUseIndex', 'inUse');
        }
    }

    if (db.objectStoreNames.contains(objectStore.pointOfSalesObjectStore)) {
        const store = request.transaction?.objectStore(objectStore.pointOfSalesObjectStore);

        if (store && !store.indexNames.contains('openingTimeIndex')) {
            store.createIndex('openingTimeIndex', 'openingTime');
        }
        if (store && !store.indexNames.contains('createdAtIndex')) {
            store.createIndex('createdAtIndex', 'createdAt');
        }
    }
} */
