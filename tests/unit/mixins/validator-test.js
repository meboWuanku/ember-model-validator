/* jshint expr:true */
import { expect } from 'chai';
import { describeModel } from 'ember-mocha';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import ValidatorMixin from '../../../mixins/validator';

describe('ValidatorMixin', function() {
  // Replace this with your real tests.
  it('works', function() {
    var ValidatorObject = Ember.Object.extend(ValidatorMixin);
    var subject = ValidatorObject.create();
    expect(subject).to.be.ok;
  });

	describeModel('fake-model','Fake model with simple validations',
	  {
	    // Specify the other units that are required for this test.
	      needs: ['model:other-model']
	  },
	  function() {
	    // Replace this with your real tests.
	    it('exists', function() {
	      var model = this.subject();
	      // var store = this.store();
	      expect(model).to.be.ok;
	    });

		  it('validates the presence of the attributes set on `validations.presence`', function() {
	      var model = this.subject();
	      expect(model.validate()).to.equal(false);
	      expect(model.get('errors').errorsFor('email').mapBy('message')[0][0]).to.equal(model.presenceMessage);
	      expect(model.get('errors').errorsFor('name').mapBy('message')[0][0]).to.equal(model.presenceMessage);
		  });

      it('validates the format of the attributes set on `validations.format`', function() {
        var model = this.subject({legacyCode: 3123123});
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('legacyCode').mapBy('message')[0][0]).to.equal(model.formatMessage);
      });

		  it('validates the email format of the attributes set on `validations.email`', function() {
	      var model = this.subject({email:'adsfasdf$'});
	      expect(model.validate()).to.equal(false);
	      expect(model.get('errors').errorsFor('email').mapBy('message')[0][0]).to.equal(model.mailMessage);
		  });

		  it('validates the numericality of the attributes set on `validations.numericality`', function() {
	      var model = this.subject({lotteryNumber:'adsfasdf$'});
	      expect(model.validate()).to.equal(false);
	      expect(model.get('errors').errorsFor('lotteryNumber').mapBy('message')[0][0]).to.equal(model.numericalityMessage);
		  });

      it('validates the inclusion of the attributes set on `validations.inclusion`', function() {
        var model = this.subject({name:'adsfasdf$'});
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('name').mapBy('message')[0][0]).to.equal(model.inclusionMessage);
      });

      it('validates the exclusion of the attributes set on `validations.exclusion`', function() {
        var model = this.subject({secondName:'Wilder Medina'});
        expect(model.validate()).to.equal(false);
        expect(model.get('errors').errorsFor('secondName').mapBy('message')[0][0]).to.equal(model.exclusionMessage);
      });

      it('validates the relations specified on `validations.relations`', function() {
      	var model = this.subject({email:'thiisagoo@email.con',name:'Jose Rene Higuita'}),
      			store = model.get('store'),
      			otherFakes = null;

        Ember.run(function() {
          otherFakes = model.get('otherFakes');

          otherFakes.pushObject(store.createRecord('other-model'));
          expect(model.validate()).to.equal(false);
        });

      });

			describe('when data is corrected after validation', function() {

			  it('it clean the erros', function() {
		      var model = this.subject({email:'adsfasdf$',name:'Jose Rene',lotteryNumber:124,legacyCode:'abc'});
		      Ember.run(function() {
		      	expect(model.validate()).to.equal(false);
		      	model.set('email','rene@higuita.com');
		      	expect(model.validate()).to.equal(true);
		      });
			  });

			});

	  }
	);


});
