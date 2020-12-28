const _ = require('lodash');
const ErrorHelper = require("../helpers/error.helper");

class Service {
    constructor(model) {
        this.model = model;
        this.modelName = model ? model.modelName : 'Resource';
    }

    async get(filters = {}, options = {}) {
        options.sort = options.sort ? options.sort : '-created_at';

        if (options.return_count) {
            return this.model.countDocuments(filters);
        }

        return this.model.find(filters, null, options);
    }

    async getById(_id, filters = {}) {
        const item = await this.model.findOne({_id, ...filters});

        /* if (!item) {
            ErrorHelper.error_not_found(`${this.modelName} doesn't exist!`);
        } */

        return item;
    }

    async findOne(filter) {
        const item = await this.model.findOne(filter);

        /* if (!item) {
            ErrorHelper.error_not_found(`${this.modelName} doesn't exist!`);
        } */

        return item;
    }

    /*  */
    parseSearchFilters(filter_fields, query) {
        let filters = {};

        for (let field of filter_fields) {
            if (field.name && query[field.name] && (typeof query[field.name] !== 'string' || query[field.name].trim())) {
                if (field.type === 'equal') {
                    if (!field.case_sensitive) {
                        filters[field.db_field] = new RegExp(`^${_.escapeRegExp(query[field.name].trim())}$`, 'i');
                    } else {
                        filters[field.db_field] = query[field.name].trim();
                    }
                } else if (field.type === 'match') {
                    if (!field.case_sensitive) {
                        filters[field.db_field] = new RegExp(`${_.escapeRegExp(query[field.name].trim())}`, 'i');
                    } else {
                        filters[field.db_field] = new RegExp(`${_.escapeRegExp(query[field.name].trim())}`);
                    }
                } else if (field.type === 'array') {
                    let field_value = _.uniq(Array.isArray(query[field.name]) ? query[field.name] : query[field.name].split(','));

                    if (field.case_sensitive) {
                        field_value = field_value.map(fv => new RegExp(`^${_.escapeRegExp(fv.trim())}$`, 'i'));
                    } else {
                        field_value = field_value.map(fv => fv.trim());
                    }

                    if (typeof field.serialize === 'function') {
                        field_value = field.serialize(field_value);

                        if (Array.isArray(field_value)) {
                            field_value = _.uniq(field_value);
                        }
                    }

                    if (typeof field.filters === 'function') {
                        filters = { ...filters, ...field.filters(field_value) };
                    } else {
                        if (field_value.length === 1) {
                            filters[field.db_field] = field_value[0];
                        } else {
                            filters[field.db_field] = { $in: field_value };
                        }
                    }
                } else if (field.type === 'boolean') {
                    if (typeof field.parse === 'function') {
                        filters[field.db_field] = field.parse(query[field.name]);
                    }
                }
            }
        }

        return filters;
    }

    async aggregate(pipeline, options = {}) {
        pipeline = this.getPipeline(pipeline, options);

        return this.model.aggregate(pipeline).then(obj => {
            if (!obj && options.throw_error !== false) {
                throw ErrorHelper.error_not_found(404, `${this.modelName} does not exist!`);
            }

            return obj;
        });
    }

    getPipeline(pipeline, options) {
        if (options.return_count !== true) {
            if (!options.sort || typeof options.sort !== 'object' || Array.isArray(options.sort)) {
                pipeline.push({ $sort: { created_at: -1 } });
            } else {
                pipeline.push({ $sort: options.sort });
            }
        }

        if (options['limit'] && options['return_count'] !== true) {
            pipeline.push({ $limit: options['limit'] });
        }

        return pipeline;
    }
}

module.exports = Service;