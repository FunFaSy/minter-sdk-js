"use strict";
/** @hidden @module */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineBuilder = exports.Assignable = exports.Enum = void 0;
class Enum {
    constructor(properties) {
        if (Object.keys(properties).length !== 1) {
            throw new Error('Enum can only take single value');
        }
        Object.keys(properties).map((key) => {
            this[key] = properties[key];
            this.enum = key;
        });
    }
}
exports.Enum = Enum;
class Assignable {
    constructor(properties) {
        Object.keys(properties).map((key) => {
            this[key] = properties[key];
        });
    }
}
exports.Assignable = Assignable;
class PipelineBuilder {
    constructor(stages) {
        this.stages = stages;
    }
    static new() {
        return new PipelineBuilder([]);
    }
    append(newStage) {
        const newStages = this.stages.slice();
        newStages.push(newStage);
        return new PipelineBuilder(newStages);
    }
    build() {
        return (input, config) => this.stages.reduce((state, stage) => stage(state, config), input);
    }
}
exports.PipelineBuilder = PipelineBuilder;
