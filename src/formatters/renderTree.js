const indent = '    ';

const stringify = (value, nestingLvl) => {
  if (value === undefined) {
    return '';
  }
  if (typeof value === 'object') {
    const result = JSON.stringify(value, null, '\t')
      .replace(/"/g, '')
      .replace(/\t/g, `${indent.repeat(nestingLvl + 2)}`)
      .replace(/}/g, `${indent.repeat(nestingLvl + 1)}}`);
    return result;
  }
  return JSON.stringify(value).replace(/"/g, '');
};

const statusActions = {
  deleted: (node, nestingLvl) => `  - ${node.name}: ${stringify(node.valueOld, nestingLvl)}`,
  added: (node, nestingLvl) => `  + ${node.name}: ${stringify(node.valueNew, nestingLvl)}`,
  unmodified: (node, nestingLvl) => `    ${node.name}: ${stringify(node.valueOld, nestingLvl)}`,
  modified: (node, nestingLvl, renderFunction) => {
    if (node.children.length === 0) {
      return [`  - ${node.name}: ${stringify(node.valueOld, nestingLvl)}`,
        `  + ${node.name}: ${stringify(node.valueNew, nestingLvl)}`];
    }
    return `    ${node.name}: ${renderFunction(node.children, nestingLvl + 1)}`;
  },
};


const renderTree = (data, nestingLvl = 0) => {
  const indents = indent.repeat(nestingLvl);

  const formatData = (node) => statusActions[node.status](node, nestingLvl, renderTree);
  const formattedData = data.map(formatData).flat().map((element) => `${indents}${element}`);

  return `{\n${formattedData.join('\n')}\n${indents}}`;
};

export default renderTree;