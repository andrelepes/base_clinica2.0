function ascendingComparator(arrayA, arrayB, orderBy) {
  if (arrayB[orderBy] < arrayA[orderBy]) {
    return 1;
  }
  if (arrayB[orderBy] > arrayA[orderBy]) {
    return -1;
  }
  return 0;
}

function descendingComparator(arrayA, arrayB, orderBy) {
  if (arrayB[orderBy] < arrayA[orderBy]) {
    return -1;
  }
  if (arrayB[orderBy] > arrayA[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (arrayA, arrayB) => descendingComparator(arrayA, arrayB, orderBy)
    : (arrayA, arrayB) => ascendingComparator(arrayA, arrayB, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedArray = array.map((element, index) => [element, index]);

  stabilizedArray.sort((arrayA, arrayB) => {
    const order = comparator(arrayA[0], arrayB[0]);
    if (order !== 0) {
      return order;
    }
    return arrayA[1] - arrayB[1];
  });

  return stabilizedArray.map((element) => element[0]);
}

export { getComparator, stableSort };
