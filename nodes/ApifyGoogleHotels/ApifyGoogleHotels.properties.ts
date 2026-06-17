import { IExecuteFunctions, INodeProperties } from 'n8n-workflow';

/**
 * Build the Apify Actor input from node parameters.
 * Only the real Actor inputs are sent; the Output / Fields parameters shape the
 * data we return, they are not part of the Actor input. Optional fields are only
 * sent when the user provides a value so the Actor keeps its own defaults.
 */
export function buildActorInput(
	context: IExecuteFunctions,
	itemIndex: number,
	defaultInput: Record<string, any>,
): Record<string, any> {
	const input: Record<string, any> = {
		...defaultInput,
		q: context.getNodeParameter('q', itemIndex),
		adults: context.getNodeParameter('adults', itemIndex),
		children: context.getNodeParameter('children', itemIndex),
		max_pages: context.getNodeParameter('max_pages', itemIndex),
	};

	const checkIn = context.getNodeParameter('check_in_date', itemIndex, '') as string;
	const checkOut = context.getNodeParameter('check_out_date', itemIndex, '') as string;
	const currency = context.getNodeParameter('currency', itemIndex, '') as string;
	const gl = context.getNodeParameter('gl', itemIndex, '') as string;
	const hl = context.getNodeParameter('hl', itemIndex, '') as string;
	const minPrice = context.getNodeParameter('min_price', itemIndex, 0) as number;
	const maxPrice = context.getNodeParameter('max_price', itemIndex, 0) as number;

	if (checkIn) input.check_in_date = checkIn;
	if (checkOut) input.check_out_date = checkOut;
	if (currency) input.currency = currency;
	if (gl) input.gl = gl;
	if (hl) input.hl = hl;
	if (minPrice > 0) input.min_price = String(minPrice);
	if (maxPrice > 0) input.max_price = String(maxPrice);

	return input;
}

const resourceProperties: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Hotel',
				value: 'hotel',
			},
		],
		default: 'hotel',
	},
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['hotel'],
			},
		},
		options: [
			{
				name: 'Search',
				value: 'search',
				action: 'Search hotels for a query and dates',
				description: 'Search hotels and vacation rentals and return one item per property',
			},
		],
		default: 'search',
	},
];

const actorProperties: INodeProperties[] = [
	{
		displayName: 'Search Query',
		name: 'q',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'e.g. hotels in Austin TX',
		description: 'Destination or query to search for',
		displayOptions: { show: { resource: ['hotel'], operation: ['search'] } },
	},
	{
		displayName: 'Check-In Date',
		name: 'check_in_date',
		type: 'string',
		default: '',
		placeholder: 'YYYY-MM-DD',
		description: 'Check-in date in YYYY-MM-DD format',
		displayOptions: { show: { resource: ['hotel'], operation: ['search'] } },
	},
	{
		displayName: 'Check-Out Date',
		name: 'check_out_date',
		type: 'string',
		default: '',
		placeholder: 'YYYY-MM-DD',
		description: 'Check-out date in YYYY-MM-DD format',
		displayOptions: { show: { resource: ['hotel'], operation: ['search'] } },
	},
	{
		displayName: 'Adults',
		name: 'adults',
		type: 'number',
		default: 2,
		typeOptions: { minValue: 1 },
		description: 'Number of adult guests',
		displayOptions: { show: { resource: ['hotel'], operation: ['search'] } },
	},
	{
		displayName: 'Children',
		name: 'children',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		description: 'Number of child guests',
		displayOptions: { show: { resource: ['hotel'], operation: ['search'] } },
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'string',
		default: '',
		placeholder: 'e.g. USD',
		description: 'Three-letter currency code for prices',
		displayOptions: { show: { resource: ['hotel'], operation: ['search'] } },
	},
	{
		displayName: 'Country Code',
		name: 'gl',
		type: 'string',
		default: '',
		placeholder: 'e.g. us',
		description: 'Two-letter country code the search runs from',
		displayOptions: { show: { resource: ['hotel'], operation: ['search'] } },
	},
	{
		displayName: 'Language Code',
		name: 'hl',
		type: 'string',
		default: '',
		placeholder: 'e.g. en',
		description: 'Two-letter language code for the results',
		displayOptions: { show: { resource: ['hotel'], operation: ['search'] } },
	},
	{
		displayName: 'Minimum Price',
		name: 'min_price',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		description: 'Only return properties at or above this nightly rate. Use 0 for no limit.',
		displayOptions: { show: { resource: ['hotel'], operation: ['search'] } },
	},
	{
		displayName: 'Maximum Price',
		name: 'max_price',
		type: 'number',
		default: 0,
		typeOptions: { minValue: 0 },
		description: 'Only return properties at or below this nightly rate. Use 0 for no limit.',
		displayOptions: { show: { resource: ['hotel'], operation: ['search'] } },
	},
	{
		displayName: 'Maximum Pages',
		name: 'max_pages',
		type: 'number',
		default: 1,
		typeOptions: { minValue: 1 },
		description: 'How many result pages to fetch',
		displayOptions: { show: { resource: ['hotel'], operation: ['search'] } },
	},
];

const outputProperties: INodeProperties[] = [
	{
		displayName: 'Output',
		name: 'output',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['hotel'], operation: ['search'] } },
		options: [
			{
				name: 'Raw',
				value: 'raw',
				description: 'Return every field the API produces for each property',
			},
			{
				name: 'Selected Fields',
				value: 'selected',
				description: 'Choose exactly which fields to return',
			},
			{
				name: 'Simplified',
				value: 'simplified',
				description: 'Return a compact set of the most useful property fields',
			},
		],
		default: 'simplified',
		description: 'How much data to return for each property',
	},
	{
		displayName: 'Fields to Include',
		name: 'fields',
		type: 'multiOptions',
		displayOptions: {
			show: { resource: ['hotel'], operation: ['search'], output: ['selected'] },
		},
		options: [
			{ name: 'Amenities', value: 'amenities' },
			{ name: 'Check-In Time', value: 'check_in_time' },
			{ name: 'Check-Out Time', value: 'check_out_time' },
			{ name: 'Essential Info', value: 'essential_info' },
			{ name: 'Excluded Amenities', value: 'excluded_amenities' },
			{ name: 'GPS Coordinates', value: 'gps_coordinates' },
			{ name: 'Images', value: 'images' },
			{ name: 'Location Rating', value: 'location_rating' },
			{ name: 'Name', value: 'name' },
			{ name: 'Nearby Places', value: 'nearby_places' },
			{ name: 'Overall Rating', value: 'overall_rating' },
			{ name: 'Prices', value: 'prices' },
			{ name: 'Property Token', value: 'property_token' },
			{ name: 'Rate per Night', value: 'rate_per_night' },
			{ name: 'Reviews', value: 'reviews' },
			{ name: 'Total Rate', value: 'total_rate' },
			{ name: 'Type', value: 'type' },
		],
		default: ['name', 'type', 'rate_per_night', 'overall_rating'],
		description: 'Which fields to return when Output is set to Selected Fields',
	},
];

const authenticationProperties: INodeProperties[] = [
	{
		displayName: 'Authentication',
		name: 'authentication',
		type: 'options',
		options: [
			{
				name: 'API Key',
				value: 'apifyApi',
			},
			{
				name: 'OAuth2',
				value: 'apifyOAuth2Api',
			},
		],
		default: 'apifyApi',
		description: 'Choose which authentication method to use',
	},
];

export const properties: INodeProperties[] = [
	...resourceProperties,
	...actorProperties,
	...outputProperties,
	...authenticationProperties,
];
