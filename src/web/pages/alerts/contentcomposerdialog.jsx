/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */


import React from 'react';

import {NO_VALUE, YES_VALUE} from 'gmp/parser';

import {isDefined} from 'gmp/utils/identity';
import PropTypes from 'web/utils/proptypes';
import {renderSelectItems, UNSET_VALUE} from 'web/utils/render';

import ComposerContent, {
  COMPOSER_CONTENT_DEFAULTS,
} from 'web/components/dialog/composercontent'; /* eslint-disable-line max-len*/

import SaveDialog from 'web/components/dialog/savedialog';

import CheckBox from 'web/components/form/checkbox';
import FormGroup from 'web/components/form/formgroup';
import Select from 'web/components/form/select';

import useTranslation from 'web/hooks/useTranslation';

const ContentComposerDialog = ({
  filterId = UNSET_VALUE,
  filters = [],
  ignorePagination = YES_VALUE,
  includeNotes = COMPOSER_CONTENT_DEFAULTS.includeNotes,
  includeOverrides = COMPOSER_CONTENT_DEFAULTS.includeOverrides,
  storeAsDefault,
  onClose,
  onFilterIdChange,
  onSave,
  onChange,
}) => {
  const [_] = useTranslation();
  const filter =
    filterId === UNSET_VALUE ? undefined : filters.find(f => f.id === filterId);

  const controlledValues = {
    filterId,
    ignorePagination,
    includeNotes,
    includeOverrides,
    storeAsDefault,
  };

  return (
    <SaveDialog
      buttonTitle={_('OK')}
      title={_('Compose Content for Scan Report')}
      values={controlledValues}
      onClose={onClose}
      onSave={onSave}
    >
      <FormGroup title={_('Report Result Filter')}>
        <Select
          name="filterId"
          value={filterId}
          items={renderSelectItems(filters, UNSET_VALUE)}
          onChange={onFilterIdChange}
        />
      </FormGroup>
      <ComposerContent
        filterFieldTitle={_(
          'To change the filter, please select a filter' +
            ' from the dropdown menu.',
        )}
        filterString={isDefined(filter) ? filter.toFilterString() : ''}
        includeNotes={includeNotes}
        includeOverrides={includeOverrides}
        onValueChange={onChange}
      />
      <CheckBox
        data-testid="ignorePagination"
        name="ignorePagination"
        checked={ignorePagination}
        checkedValue={YES_VALUE}
        uncheckedValue={NO_VALUE}
        title={_('Ignore Pagination')}
        onChange={onChange}
      />
      <CheckBox
        name="storeAsDefault"
        checked={storeAsDefault}
        checkedValue={YES_VALUE}
        unCheckedValue={NO_VALUE}
        toolTipTitle={_('Store indicated settings (without filter) as default')}
        title={_('Store as default')}
        onChange={onChange}
      />
    </SaveDialog>
  );
};

ContentComposerDialog.propTypes = {
  defaultReportFormatId: PropTypes.id,
  filterId: PropTypes.toString,
  filterString: PropTypes.string,
  filters: PropTypes.array,
  ignorePagination: PropTypes.number,
  includeNotes: PropTypes.number,
  includeOverrides: PropTypes.number,
  reportFormatId: PropTypes.id,
  reportFormats: PropTypes.array,
  storeAsDefault: PropTypes.number,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onFilterIdChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default ContentComposerDialog;

// vim: set ts=2 sw=2 tw=80:
