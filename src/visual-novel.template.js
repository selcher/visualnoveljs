/**
 * Function: TemplateFactory
 *
 */
function TemplateFactory( templates ) {

	var template = null;

	if ( this instanceof TemplateFactory ) {

		this.templates = templates ? templates : {};

		template = this;

	} else {

		template = new TemplateFactory( templates );

	}

	return template;

}

/**
 * Function: get
 *
 * Get a template
 *
 * @param name
 */
TemplateFactory.prototype.get = function get( name ) {

	var templates = this.templates;
	var template = templates[ name ] ? templates[ name ].join( '' ) : '';

	return template;

};

/**
 * Function: set
 *
 * Store a template
 *
 * @param name
 * @param template
 */
TemplateFactory.prototype.set = function set( name, template ) {

	this.templates[ name ] = template;

	return this;

};