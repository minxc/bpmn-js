import inherits from 'inherits';

import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import { is } from '../../../util/ModelUtil';


/**
 * BPMN specific create boundary event behavior
 */
export default function CreateBoundaryEventBehavior(
    eventBus, modeling, elementFactory,
    bpmnFactory) {

  CommandInterceptor.call(this, eventBus);

  /**
   * replace intermediate event with boundary event when
   * attaching it to a shape
   */

  this.preExecute('shape.create', function(context) {
    var shape = context.shape,
        host = context.host,
        businessObject,
        boundaryEvent;

    var attrs = {
      cancelActivity: true
    };

    if (host && is(shape, 'bpmn:IntermediateThrowEvent')) {
      attrs.attachedToRef = host.businessObject;

      businessObject = bpmnFactory.create('bpmn:BoundaryEvent', attrs);

      boundaryEvent = {
        type: 'bpmn:BoundaryEvent',
        businessObject: businessObject
      };

      context.shape = elementFactory.createShape(boundaryEvent);
    }
  }, true);

  this.preExecute('elements.move', function(context) {
    var shapes = context.shapes,
        host = context.newHost,
        shape,
        businessObject,
        boundaryEvent;

    if (shapes.length !== 1) {
      return;
    }

    shape = shapes[0];

    var attrs = {
      cancelActivity: true
    };

    if (host && is(shape, 'bpmn:IntermediateThrowEvent')) {
      attrs.attachedToRef = host.businessObject;

      businessObject = bpmnFactory.create('bpmn:BoundaryEvent', attrs);

      boundaryEvent = {
        type: 'bpmn:BoundaryEvent',
        businessObject: businessObject
      };

      modeling.replaceShape(shape, boundaryEvent);
    }
  }, true);
}

CreateBoundaryEventBehavior.$inject = [
  'eventBus',
  'modeling',
  'elementFactory',
  'bpmnFactory'
];

inherits(CreateBoundaryEventBehavior, CommandInterceptor);
