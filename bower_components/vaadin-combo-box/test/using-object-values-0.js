
    describe('using object values', function() {
      var combobox;

      function inputValue() {
        return combobox.$.input.bindValue;
      }

      beforeEach(function() {
        combobox = fixture('combobox');

        combobox.items = [{
          label: 'foo',
          custom: 'bazs',
          value: 'bar'
        }, {
          label: 'baz',
          custom: 'bashcsdfsa',
          value: 'qux'
        }, {
          label: 'zero',
          custom: 'zero-custom',
          value: 0
        }, {
          label: 'false',
          custom: 'false-custom',
          value: false
        }, {
          label: 'empty string',
          custom: 'empty-string-custom',
          value: ''
        }, {
          label: 'zero as a string',
          custom: 'zero-string-custom',
          value: '0'
        }, {
          label: 'duplicate value 1',
          value: 'duplicate'
        }, {
          label: 'duplicate value 2',
          value: 'duplicate'
        }, {
          label: 'missing value 1'
        }, {
          label: 'missing value 2'
        }];
      });

      function selectItem(index) {
        // simulates tapping on the overlay items, but it more reliable in tests.
        combobox.$.overlay.fire('selection-changed', {item: combobox.items[index]});
      }

      beforeEach(function() {
        combobox.open();
      });

      it('should use the default label property on input field', function() {
        selectItem(0);

        expect(inputValue()).to.eql('foo');
      });

      it('should use the default label property in overlay items', function(done) {
        combobox.async(function() {
          var firstItem = combobox.$.overlay.$.selector.querySelector('vaadin-combo-box-item');
          expect(Polymer.dom(firstItem.root).textContent).to.contain('foo');
          done();
        }, 1);
      });

      it('should use the provided label property', function() {
        combobox.itemLabelPath = 'custom';

        combobox.value = 'bar';

        expect(inputValue()).to.eql('bazs');
      });

      it('should use the default value property', function() {
        selectItem(0);

        expect(combobox.value).to.eql('bar');

      });

      it('should use the provided value property', function() {
        combobox.itemValuePath = 'custom';

        selectItem(1);

        expect(combobox.value).to.eql('bashcsdfsa');
      });

      it('should use toString if provided label and value paths are not found', function() {
        combobox.itemValuePath = 'not.found';
        combobox.itemLabelPath = 'not.found';
        combobox.items[0].toString = function() {
          return 'default';
        };

        selectItem(0);

        expect(combobox.$.input.bindValue).to.eql('default');
        expect(combobox.value).to.eql('default');
      });

      it('should use toString if default label and value paths are not found', function() {
        combobox.items = [{}, {}];
        combobox.items[0].toString = function() {
          return 'default';
        };

        selectItem(0);

        expect(combobox.$.input.bindValue).to.eql('default');
        expect(combobox.value).to.eql('default');
      });

      it('should set the selected item when open', function() {
        combobox.value = 'bar';

        expect(combobox.selectedItem).to.eql(combobox.items[0]);
        expect(combobox.$.input.bindValue).to.eql('foo');
      });

      it('should set the selected item when closed', function() {
        combobox.opened = false;

        combobox.value = 'bar';

        expect(combobox.selectedItem).to.eql(combobox.items[0]);
        expect(combobox.$.input.bindValue).to.eql('foo');
      });

      it('should set the value', function() {
        selectItem(0);

        expect(combobox.$.input.bindValue).to.eql('foo');
        expect(combobox.value).to.eql('bar');
      });

      it('should set the value even if the value is zero (number)', function() {
        selectItem(2);

        expect(combobox.$.input.bindValue).to.eql('zero');
        expect(combobox.value).to.eql(0);
      });

      it('should set the value even if the value is false (boolean)', function() {
        selectItem(3);

        expect(combobox.$.input.bindValue).to.eql('false');
        expect(combobox.value).to.eql(false);
      });

      it('should set the value even if the value is an empty string', function() {
        selectItem(4);

        expect(combobox.$.input.bindValue).to.eql('empty string');
        expect(combobox.value).to.eql('');
        expect(combobox.hasValue).to.eql(true);
      });

      it('should distinguish between 0 (number) and "0" (string) values', function() {
        selectItem(2);
        expect(combobox.$.input.bindValue).to.eql('zero');
        expect(combobox.value).to.eql(0);

        selectItem(5);
        expect(combobox.$.input.bindValue).to.eql('zero as a string');
        expect(combobox.value).to.eql('0');
      });

      it('should set the input value from item label if item is found', function() {
        combobox.value = 'bar';

        expect(combobox.$.input.bindValue).to.eql('foo');
      });

      it('should select first of duplicate values', function() {
        combobox.value = 'duplicate';

        expect(combobox.selectedItem).to.eql(combobox.items[6]);
      });

      it('should select correct duplicate value', function() {
        var spy = sinon.spy();
        combobox.addEventListener('selected-item-changed', spy);

        selectItem(7);

        expect(combobox.selectedItem).to.eql(combobox.items[7]);
        expect(combobox.value).to.eql('duplicate');
        expect(combobox.$.input.bindValue).to.eql('duplicate value 2');
        expect(spy.callCount).to.eql(1);
      });

      it('should select correct with missing value', function() {
        var spy = sinon.spy();
        combobox.addEventListener('selected-item-changed', spy);

        selectItem(9);

        expect(combobox.selectedItem).to.eql(combobox.items[9]);
        expect(combobox.value).to.eql(combobox.items[9].toString());
        expect(combobox.$.input.bindValue).to.eql('missing value 2');
        expect(spy.callCount).to.eql(1);
      });

      describe('when custom values are not allowed', function() {
        beforeEach(function() {
          combobox.allowCustomValue = false;
        });

        it('should clear the input value if item is not found', function() {
          combobox.value = 'bar';

          combobox.value = 'not found';

          expect(combobox.$.input.bindValue).to.empty;
        });
      });

      describe('when custom values are allowed', function() {
        beforeEach(function() {
          combobox.allowCustomValue = true;
        });

        it('should set the value as bind value if item is not found', function() {
          combobox.value = 'not found';

          expect(combobox.$.input.bindValue).to.eql('not found');
        });
      });
    });
  