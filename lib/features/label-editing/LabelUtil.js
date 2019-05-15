import { is } from '../../util/ModelUtil';

function getLabelAttr(semantic) {
  if (
    is(semantic, 'bpmn:FlowElement') ||
    is(semantic, 'bpmn:Participant') ||
    is(semantic, 'bpmn:Lane') ||
    is(semantic, 'bpmn:SequenceFlow') ||
    is(semantic, 'bpmn:MessageFlow') ||
    is(semantic, 'bpmn:DataInput') ||
    is(semantic, 'bpmn:DataOutput')
  ) {
    return 'name';
  }

  if (is(semantic, 'bpmn:TextAnnotation')) {
    return 'text';
  }

  if (is(semantic, 'bpmn:Group')) {
    return 'nested';
  }
}

export function getLabel(element) {
  var semantic = element.businessObject,
      attr = getLabelAttr(semantic);

  if (attr) {

    // TODO: refactor me
    if (attr === 'nested') {
      return semantic['categoryValueRef'] ? semantic['categoryValueRef'].value : '';
    }

    return semantic[attr] || '';
  }
}


export function setLabel(element, text, isExternal) {
  var semantic = element.businessObject,
      attr = getLabelAttr(semantic);

  if (attr) {

    if (attr === 'nested') {
      // TODO: create missing categoryValue somewhere, if necessary
      semantic['categoryValueRef'].value = text;
    }

    semantic[attr] = text;
  }

  return element;
}