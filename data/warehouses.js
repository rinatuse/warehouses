// Данные о структуре складов и их содержимом
export const warehouseData = [
    {
      id: 1,
      name: "Основной склад",
      containers: [
        {
          id: 101,
          name: "Контейнер №1",
          cells: [
            { id: "A1", row: "A", shelf: "1", product: { code: "01", name: "вода", quantity: 20, unit: "л" } },
            { id: "A2", row: "A", shelf: "2", product: { code: "01", name: "вода", quantity: 20, unit: "л" } },
            { id: "B1", row: "B", shelf: "1", product: { code: "02", name: "ведро", quantity: 3, unit: "шт" } },
            { id: "B2", row: "B", shelf: "2", product: { code: "02", name: "ведро", quantity: 3, unit: "шт" } },
            { id: "C1", row: "C", shelf: "1", product: { code: "04", name: "перчатки", quantity: 15, unit: "пара" } },
            { id: "C2", row: "C", shelf: "2", product: { code: "10", name: "плоскогубцы", quantity: 5, unit: "шт" } },
          ]
        },
        {
          id: 102,
          name: "Контейнер №2",
          cells: [
            { id: "A1", row: "A", shelf: "1", product: { code: "05", name: "гвозди 100мм", quantity: 25, unit: "кг" } },
            { id: "A2", row: "A", shelf: "2", product: { code: "06", name: "саморезы 25мм", quantity: 15, unit: "кг" } },
            { id: "B1", row: "B", shelf: "1", product: { code: "07", name: "болт М10", quantity: 120, unit: "шт" } },
            { id: "B2", row: "B", shelf: "2", product: { code: "08", name: "гайка М10", quantity: 150, unit: "шт" } },
          ]
        },
        {
          id: 103,
          name: "Персонал",
          cells: [
            { id: "P1", row: "Вячеслав", shelf: "-", product: { code: "02", name: "ведро", quantity: 1, unit: "шт" } },
            { id: "P2", row: "Иванов И.И.", shelf: "-", product: null },
            { id: "P3", row: "Петров П.П.", shelf: "-", product: null },
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Холодный склад",
      containers: [
        {
          id: 201,
          name: "Зона А",
          cells: [
            { id: "A1", row: "A", shelf: "1", product: { code: "03", name: "шланг", quantity: 0, unit: "шт" } },
            { id: "A2", row: "A", shelf: "2", product: null },
            { id: "B1", row: "B", shelf: "1", product: null },
          ]
        }
      ]
    }
  ];