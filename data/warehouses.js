// Данные о структуре складов и их содержимом
export const warehouseData = [
  {
    id: 1,
    name: "Основной склад",
    containers: [
      {
        id: 101,
        name: "Контейнер №1",
        products: [
          { code: "01", name: "вода", quantity: 40, unit: "л" },
          { code: "02", name: "ведро", quantity: 6, unit: "шт" },
          { code: "04", name: "перчатки", quantity: 15, unit: "пара" },
          { code: "10", name: "плоскогубцы", quantity: 5, unit: "шт" },
        ]
      },
      {
        id: 102,
        name: "Контейнер №2",
        products: [
          { code: "05", name: "гвозди 100мм", quantity: 25, unit: "кг" },
          { code: "06", name: "саморезы 25мм", quantity: 15, unit: "кг" },
          { code: "07", name: "болт М10", quantity: 120, unit: "шт" },
          { code: "08", name: "гайка М10", quantity: 150, unit: "шт" },
        ]
      },
      {
        id: 103,
        name: "Персонал",
        products: [
          { code: "02", name: "ведро", quantity: 1, unit: "шт" },
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
        products: [
          { code: "03", name: "шланг", quantity: 0, unit: "шт" },
        ]
      }
    ]
  }
];