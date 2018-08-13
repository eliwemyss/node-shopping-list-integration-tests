const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('recipes', function() {
	before(function() {
		return runServer();
	});
	after(function() {
		return closeServer();
	});
	it('should list items on GET', function() {
		return chai.request(app)
			.get('/recipes')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.json;
				expect(res).to.be.a('array');
				expect(res.body.lengeth).to.be.at.least(1);
				const expectedKeys = ['id', 'name', 'ingredients'];
				res.body.forEach(function(item) {
					expect(item).to.be.a('object');
					expect(item).to.include.keys(expectedKeys);
			});
		});
	}); 

	it('should add a recipe on POST', function() {
		const newRecipe = {
			name: 'cereal', ingredients: ['cereal', 'milk']};
		return chai.request(app)
			.post('/recipes')
			.send(newRecipe)
			.then(function(res) {
				res.to.have.status(201);
				res.to.be.json;
				res.body.to.be.a('object');
				res.body.to.include.keys('id', 'name', 'ingredients');
				res.body.id.to.not.equal(null);
				res.body.to.deep.equal(
					Object.assign(newRecipe, {id: res.body.id})
					);
			});
	});

	it('should update recipe on PUT', function() {
		const updateRecipe = {
			name: 'something',
			ingredients: ['something else', 'more stuff']
		};
		return chai.request(app)
		.get('/recipes')
		.then(function(res) {
			updateRecipe.id = res.body[0].id;

			return chai.request(app)
				.put(`/recipes/${updateRecipe.id}`)
				.send(updateRecipe)
		});
	});

	it('should delete recipes on DELETE', function() {
		return chai.request(app)
		.get('/recipes')
		.then(function(res) {
			return chai.request(app)
				.delete(`/recipes/${res.body[0].id}`)
		})
		.then(function(res) {
			res.to.have.status(204);
		})
	});
});