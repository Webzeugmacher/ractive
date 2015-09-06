test( 'on-click="someEvent" fires an event when user clicks the element', t => {
	var ractive;

	expect( 2 );

	ractive = new Ractive({
		el: fixture,
		template: '<span id="test" on-click="someEvent">click me</span>'
	});

	ractive.on( 'someEvent', function ( event ) {
		t.ok( true );
		t.equal( event.original.type, 'click' );
	});

	simulant.fire( ractive.nodes.test, 'click' );
});

test( 'empty event on-click="" ok', t => {
	var ractive;

	expect( 0 );

	ractive = new Ractive({
		el: fixture,
		template: '<span id="test" on-click="">click me</span>'
	});

	simulant.fire( ractive.nodes.test, 'click' );
})

test( 'on-click="someEvent" does not fire event when unrendered', t => {
	var ractive, node;

	expect( 0 );

	ractive = new Ractive({
		el: fixture,
		template: '<span id="test" on-click="someEvent">click me</span>'
	});

	ractive.on( 'someEvent', function ( event ) {
		throw new Error('Event handler called after unrender');
	});

	node = ractive.nodes.test;

	ractive.unrender();

	simulant.fire( node, 'click' );
});

test( 'Standard events have correct properties: node, original, keypath, context, index, name', t => {
	var ractive;

	expect( 6 );

	ractive = new Ractive({
		el: fixture,
		template: '<span id="test" on-click="someEvent">click me</span>'
	});

	ractive.on( 'someEvent', function ( event ) {
		t.equal( event.node, ractive.nodes.test );
		t.equal( event.name, 'someEvent' );
		t.ok( event.original );
		t.equal( event.keypath, '' );
		t.deepEqual( event.context, {} );
		t.ok( typeof event.index === 'object' && Object.keys( event.index ).length === 0 );
	});

	simulant.fire( ractive.nodes.test, 'click' );
});

test( 'preventDefault and stopPropagation if event handler returned false', t => {
	var ractive, preventedDefault = false, stoppedPropagation = false;

	expect( 9 );

	ractive = new Ractive({
		el: fixture,
		template: '<span id="return_false" on-click="returnFalse">click me</span>' +
					'<span id="return_undefined" on-click="returnUndefined">click me</span>' +
					'<span id="return_zero" on-click="returnZero">click me</span> ' +
					'<span id="multiHandler" on-click="multiHandler">click me</span> '
	});

	function mockOriginalEvent( original ) {
		preventedDefault = stoppedPropagation = false;
		original.preventDefault = function() { preventedDefault = true; }
		original.stopPropagation = function() { stoppedPropagation = true; }
	}

	ractive.on( 'returnFalse', function ( event ) {
		t.ok( true );
		mockOriginalEvent( event.original );
		return false;
	});
	ractive.on( 'returnUndefined', function ( event ) {
		t.ok( true );
		mockOriginalEvent( event.original );
	});
	ractive.on( 'returnZero', function ( event ) {
		t.ok( true );
		mockOriginalEvent( event.original );
		return 0;
	});

	ractive.on( 'multiHandler', function ( event ) {
		t.ok( true );
		mockOriginalEvent( event.original );
		return false;
	});
	ractive.on( 'multiHandler', function ( event ) {
		t.ok( true );
		mockOriginalEvent( event.original );
		return 0;
	});

	simulant.fire( ractive.nodes.return_false, 'click' );
	t.ok( preventedDefault && stoppedPropagation );

	simulant.fire( ractive.nodes.return_undefined, 'click' );
	t.ok( !preventedDefault && !stoppedPropagation );

	simulant.fire( ractive.nodes.return_zero, 'click' );
	t.ok( !preventedDefault && !stoppedPropagation );

	simulant.fire( ractive.nodes.multiHandler, 'click' );
	t.ok( preventedDefault && stoppedPropagation );
});

test( 'event.keypath is set to the innermost context', t => {
	var ractive;

	expect( 2 );

	ractive = new Ractive({
		el: fixture,
		template: '{{#foo}}<span id="test" on-click="someEvent">click me</span>{{/foo}}',
		data: {
			foo: { bar: 'test' }
		}
	});

	ractive.on( 'someEvent', function ( event ) {
		t.equal( event.keypath, 'foo' );
		t.equal( event.context.bar, 'test' );
	});

	simulant.fire( ractive.nodes.test, 'click' );
});

test( 'event.index stores current indices against their references', t => {
	var ractive;

	expect( 4 );

	ractive = new Ractive({
		el: fixture,
		template: '<ul>{{#array:i}}<li id="item_{{i}}" on-click="someEvent">{{i}}: {{.}}</li>{{/array}}</ul>',
		data: {
			array: [ 'a', 'b', 'c', 'd', 'e' ]
		}
	});

	ractive.on( 'someEvent', function ( event ) {
		t.equal( event.node.innerHTML, '2: c' );
		t.equal( event.keypath, 'array.2' );
		t.equal( event.context, 'c' );
		t.equal( event.index.i, 2 );
	});

	simulant.fire( ractive.nodes.item_2, 'click' );
});

test( 'event.index reports nested indices correctly', t => {
	var ractive;

	expect( 4 );

	ractive = new Ractive({
		el: fixture,
		template: '{{#foo:x}}{{#bar:y}}{{#baz:z}}<span id="test_{{x}}{{y}}{{z}}" on-click="someEvent">{{x}}{{y}}{{z}}</span>{{/baz}}{{/bar}}{{/foo}}',
		data: {
			foo: [
				{
					bar: [
						{
							baz: [ 1, 2, 3 ]
						}
					]
				}
			]
		}
	});

	t.equal( ractive.nodes.test_001.innerHTML, '001' );

	ractive.on( 'someEvent', function ( event ) {
		t.equal( event.index.x, 0 );
		t.equal( event.index.y, 0 );
		t.equal( event.index.z, 1 );
	});

	simulant.fire( ractive.nodes.test_001, 'click' );
});

test( 'proxy events can have dynamic names', t => {
	var ractive, last;

	expect( 2 );

	ractive = new Ractive({
		el: fixture,
		template: '<span id="test" on-click="do_{{something}}">click me</span>',
		data: { something: 'foo' }
	});

	ractive.on({
		do_foo: function ( event ) {
			last = 'foo';
		},
		do_bar: function ( event ) {
			last = 'bar';
		}
	});

	simulant.fire( ractive.nodes.test, 'click' );
	t.equal( last, 'foo' );

	ractive.set( 'something', 'bar' );

	simulant.fire( ractive.nodes.test, 'click' );
	t.equal( last, 'bar' );
});

test( 'proxy event parameters are correctly parsed as JSON, or treated as a string', t => {
	var ractive, last;

	expect( 3 );

	ractive = new Ractive({
		el: fixture,
		template: '<span id="foo" on-click="log:one">click me</span><span id="bar" on-click=\'log:{"bar":true}\'>click me</span><span id="baz" on-click="log:[1,2,3]">click me</span>'
	});

	ractive.on({
		log: function ( event, params ) {
			last = params;
		}
	});

	simulant.fire( ractive.nodes.foo, 'click' );
	t.equal( last, 'one' );

	simulant.fire( ractive.nodes.bar, 'click' );
	t.deepEqual( last, { bar: true } );

	simulant.fire( ractive.nodes.baz, 'click' );
	t.deepEqual( last, [ 1, 2, 3 ] );
});

test( 'proxy events can have dynamic arguments', t => {
	var ractive;

	ractive = new Ractive({
		el: fixture,
		template: '<span id="foo" on-click="foo:{{foo}}">click me</span>',
		data: { foo: 'bar' }
	});

	expect( 1 );

	ractive.on({
		foo: function ( event, foo ) {
			t.equal( foo, 'bar' );
		}
	});

	simulant.fire( ractive.nodes.foo, 'click' );
});

test( 'proxy events can have multiple arguments', t => {
	var ractive;

	ractive = new Ractive({
		el: fixture,
		template: '<span id="foo" on-click="one:1,2,3">click me</span><span id="bar" on-click="two:{a:1},{b:2}">click me</span><span id="baz" on-click="three:{c:{{c}}},{d:\'{{d}}\'}">click me</span>',
		data: { c: 3, d: 'four' }
	});

	expect( 7 );

	ractive.on({
		one: function ( event, one, two, three ) {
			t.equal( one, 1 );
			t.equal( two, 2 );
			t.equal( three, 3 );
		},
		two: function ( event, one, two ) {
			t.equal( one.a, 1 );
			t.equal( two.b, 2 );
		},
		three: function ( event, three, four ) {
			t.equal( three.c, 3 );
			t.equal( four.d, 'four' );
		}
	});

	simulant.fire( ractive.nodes.foo, 'click' );
	simulant.fire( ractive.nodes.bar, 'click' );
	simulant.fire( ractive.nodes.baz, 'click' );
});

test( 'Splicing arrays correctly modifies proxy events', t => {
	var ractive;

	expect( 4 );

	ractive = new Ractive({
		el: fixture,
		template: `
			{{#buttons:i}}
				<button id="button_{{i}}" on-click="remove:{{i}}">click me</button>
			{{/buttons}}`,
		data: { buttons: new Array(5) }
	});

	ractive.on( 'remove', function ( event, num ) {
		this.splice( 'buttons', num, 1 );
	});

	t.equal( ractive.findAll( 'button' ).length, 5 );

	simulant.fire( ractive.nodes.button_2, 'click' );
	t.equal( ractive.findAll( 'button' ).length, 4 );

	simulant.fire( ractive.nodes.button_2, 'click' );
	t.equal( ractive.findAll( 'button' ).length, 3 );

	simulant.fire( ractive.nodes.button_2, 'click' );
	t.equal( ractive.findAll( 'button' ).length, 2 );
});

test( 'Splicing arrays correctly modifies two-way bindings', t => {
	expect( 25 );

	let items = [
		{ description: 'one' },
		{ description: 'two', done: true },
		{ description: 'three' }
	];

	const ractive = new Ractive({
		el: fixture,
		template: `
			<ul>
				{{#items:i}}
					<li>
						<input id="input_{{i}}" type="checkbox" checked="{{.done}}">
						{{description}}
					</li>
				{{/items}}
			</ul>`,
		data: { items }
	});

	// 1-3
	t.equal( ractive.nodes.input_0.checked, false );
	t.equal( ractive.nodes.input_1.checked, true );
	t.equal( ractive.nodes.input_2.checked, false );

	// 4-6
	t.equal( !!ractive.get( 'items.0.done' ), false );
	t.equal( !!ractive.get( 'items.1.done' ), true );
	t.equal( !!ractive.get( 'items.2.done' ), false );

	simulant.fire( ractive.nodes.input_0, 'click' );

	// 7-9
	t.equal( ractive.nodes.input_0.checked, true );
	t.equal( ractive.nodes.input_1.checked, true );
	t.equal( ractive.nodes.input_2.checked, false );

	// 10-12
	t.equal( !!ractive.get( 'items.0.done' ), true );
	t.equal( !!ractive.get( 'items.1.done' ), true );
	t.equal( !!ractive.get( 'items.2.done' ), false );

	ractive.shift('items');

	// 13-14
	t.equal( ractive.nodes.input_0.checked, true );
	t.equal( ractive.nodes.input_1.checked, false );

	// 15-16
	t.equal( !!ractive.get( 'items.0.done' ), true );
	t.equal( !!ractive.get( 'items.1.done' ), false );

	simulant.fire( ractive.nodes.input_0, 'click' );

	// 17-18
	t.equal( ractive.nodes.input_0.checked, false );
	t.equal( ractive.nodes.input_1.checked, false );

	// 19-20
	t.equal( !!ractive.get( 'items.0.done' ), false );
	t.equal( !!ractive.get( 'items.1.done' ), false );

	simulant.fire( ractive.nodes.input_1, 'click' );

	// 21-22
	t.equal( ractive.nodes.input_0.checked, false );
	t.equal( ractive.nodes.input_1.checked, true );

	// 23-24
	t.equal( !!ractive.get( 'items.0.done' ), false );
	t.equal( !!ractive.get( 'items.1.done' ), true );

	// 25
	t.equal( ractive.findAll( 'input' ).length, 2 );
});

test( 'Changes triggered by two-way bindings propagate properly (#460)', t => {
	var changes, ractive = new Ractive({
		el: fixture,
		template: `
			{{#items}}
				<label>
					<input type="checkbox" checked="{{completed}}"> {{description}}
				</label>
			{{/items}}

			<p class="result">
				{{ items.filter( completed ).length }}
			</p>

			{{#if items.filter( completed ).length}}
				<p class="conditional">foo</p>
			{{/if}}`,
		data: {
			items: [
				{ completed: true, description: 'fix this bug' },
				{ completed: false, description: 'fix other bugs' },
				{ completed: false, description: 'housework' }
			],
			completed: function ( item ) {
				return !!item.completed;
			}
		}
	});

	ractive.on( 'change', function ( c ) {
		changes = c;
	});

	t.htmlEqual( ractive.find( '.result' ).innerHTML, '1' );

	simulant.fire( ractive.findAll( 'input' )[1], 'click' );
	t.htmlEqual( ractive.find( '.result' ).innerHTML, '2' );

	t.equal( changes[ 'items.1.completed' ], true );

	simulant.fire( ractive.findAll( 'input' )[0], 'click' );
	simulant.fire( ractive.findAll( 'input' )[1], 'click' );
	t.htmlEqual( ractive.find( '.result' ).innerHTML, '0' );
});

test( 'Multiple events can share the same directive', t => {
	var ractive, count = 0;

	ractive = new Ractive({
		el: fixture,
		template: '<div on-click-mouseover="foo"></div>'
	});

	ractive.on( 'foo', function () {
		count += 1;
	});

	simulant.fire( ractive.find( 'div' ), 'click' );
	t.equal( count, 1 );

	simulant.fire( ractive.find( 'div' ), 'mouseover' );
	t.equal( count, 2 );
});

test( 'Superfluous whitespace is ignored', t => {
	var ractive, fooCount = 0, barCount = 0;

	ractive = new Ractive({
		el: fixture,
		template: '<div class="one" on-click=" foo "></div><div class="two" on-click="{{#bar}} bar {{/}}"></div>'
	});

	ractive.on({
		foo: function () {
			fooCount += 1;
		},
		bar: function () {
			barCount += 1;
		}
	});

	simulant.fire( ractive.find( '.one' ), 'click' );
	t.equal( fooCount, 1 );

	simulant.fire( ractive.find( '.two' ), 'click' );
	t.equal( barCount, 0 );

	ractive.set( 'bar', true );
	simulant.fire( ractive.find( '.two' ), 'click' );
	t.equal( barCount, 1 );
});

test( '@index can be used in proxy event directives', t => {
	var ractive = new Ractive({
		el: fixture,
		template: `
			{{#each letters}}
				<button class="proxy" on-click="select:{{@index}}"></button>
				<button class="method" on-click="select(@index)"></button>
			{{/each}}`,
		data: { letters: [ 'a', 'b', 'c' ] }
	});

	expect( 3 );

	ractive.select = ( idx ) => t.equal( idx, 1 );

	ractive.on( 'select', ( event, index ) => t.equal( index, 1 ) );

	simulant.fire( ractive.findAll( 'button[class=proxy]' )[1], 'click' );
	simulant.fire( ractive.findAll( 'button[class=method]' )[1], 'click' );

	ractive.splice( 'letters', 0, 1 );
	ractive.splice( 'letters', 1, 0, 'a' );
	simulant.fire( ractive.findAll( 'button[class=method]' )[1], 'click' );
});

test( 'Proxy event arguments update correctly (#2098)', t => {
	const one = { number: 1 };
	const two = { number: 2 };

	const ractive = new Ractive({
		el: fixture,
		template: `<button type="button" on-click="checkValue:{{current}}">foo</button>`
	});

	ractive.set( 'current', one );
	ractive.set( 'current', two );

	let expected = two;

	ractive.on( 'checkValue', ( event, value ) => {
		t.strictEqual( value, expected );
		ractive.set( 'current', one );
		expected = one;
	});

	const button = ractive.find( 'button' );

	expect( 2 );
	simulant.fire( button, 'click' );
	simulant.fire( button, 'click' );
});

// This fails as of 0.8.0... does that matter? Seems unnecessary to support
// test( 'Events really do not call addEventListener when no proxy name', t => {
// 	var ractive,
// 		addEventListener = Element.prototype.addEventListener,
// 		errorAdd = function(){
// 			throw new Error('addEventListener should not be called')
// 		};
//
// 	try {
// 		Element.prototype.addEventListener = errorAdd;
//
// 		expect( 1 );
//
// 		ractive = new Ractive({
// 			el: fixture,
// 			template: '<span id="test" on-click="{{foo}}">click me</span>'
// 		});
//
// 		ractive.on('bar', function(){
// 			t.ok( true );
// 		})
//
// 		simulant.fire( ractive.nodes.test, 'click' );
//
// 		Element.prototype.addEventListener = addEventListener;
// 		ractive.set( 'foo', 'bar' );
// 		simulant.fire( ractive.nodes.test, 'click' );
//
// 		Element.prototype.addEventListener = errorAdd;
// 		ractive.set( 'foo', ' ' );
// 		simulant.fire( ractive.nodes.test, 'click' );
// 	}
// 	finally {
// 		Element.prototype.addEventListener = addEventListener;
// 	}
// });
