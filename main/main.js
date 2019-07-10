'use strict';

const itemMenu = loadAllItems();
const promotionMenu = loadPromotions();

function printReceipt(tags) {
  let handledTagObject = handleBarcodes(tags);
  let itemsWithCount = findItems(handledTagObject, itemMenu);
  let priceObject = calculatePrice(itemsWithCount, promotionMenu);
  console.log(createReceipt(priceObject, itemsWithCount));
}

function handleBarcodes(tags) {
  let tagObj = {};
  tags.forEach((tag) => {
    if (tag.indexOf('-') > -1) {
      let arr = tag.split('-');
      let itemId = arr[0];
      let itemWeight = parseFloat(arr[1]);
      tagObj[itemId] = tagObj[itemId] === undefined ? itemWeight : tagObj[itemId] + itemWeight;
    } else {
      tagObj[tag] = tagObj[tag] === undefined ? 1 : tagObj[tag] + 1;
    }
  });
  return tagObj;
}

function findItems(barcodeObject, itemMenu) {
  let itemsWithCount = [];
  for (let item of itemMenu) {
    item.count = barcodeObject[item.barcode];
    itemsWithCount.push(item);
  }
  return itemsWithCount.filter((num) => num.count == undefined ? false : true);
}

function calculatePrice(itemsWithCount, promotionMenu) {
  let priceObj = {};
  let oldPrice = 0;
  let savePrice = 0;
  for (let promotion of promotionMenu) {
    for (let item of itemsWithCount) {
      item.total = item.count * item.price;
      oldPrice += item.total;
      if (promotion.barcodes.indexOf(item.barcode) > -1) {
        item.total = Math.ceil((2 / 3) * item.count) * item.price;
        savePrice += item.count * item.price - item.total;
      }
    }
  }
  priceObj.oldPrice = oldPrice;
  priceObj.savePrice = savePrice;
  return priceObj;
}

function createReceipt(priceObject, itemsWithCount) {
  let receipt = `***<没钱赚商店>收据***
`;
  for (let item of itemsWithCount) {
    receipt += `名称：${item.name}，数量：${item.count}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${parseFloat(item.total).toFixed(2)}(元)
`;
  }
  receipt += `----------------------
总计：${(priceObject.oldPrice - priceObject.savePrice).toFixed(2)}(元)
节省：${priceObject.savePrice.toFixed(2)}(元)
**********************`
  return receipt;
}

//TODO: 请在该文件中实现练习要求并删除此注释
