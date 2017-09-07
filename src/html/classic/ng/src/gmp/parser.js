/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2017 Greenbone Networks GmbH
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA.
 */

import moment from 'moment';

import {
  is_defined,
  is_empty,
  parse_float,
  parse_int,
  parse_yesno,
  NO_VALUE,
  YES_VALUE,
} from './utils.js';

// export imported parse stuff from utils
// this code will be moved at this place in future
export {
  parse_int,
  parse_float,
  parse_yesno,
  YES_VALUE,
  NO_VALUE,
};

export function parse_severity(value) {
  return is_empty(value) ? undefined : parse_float(value);
}

export function parse_text(text) {
  if (is_defined(text.__text)) {
    return {
      text: text.__text,
      text_excerpt: text.__excerpt,
    };
  }

  return {
    text,
    text_excerpt: '0',
  };
}

export function parse_csv(value) {
  if (is_empty(value)) {
    return [];
  }
  return value.split(',').map(val => val.trim());
}

export function parse_envelope_meta(envelope) {
  let meta = {};

  let props = [
    'version',
    'backend_operation',
    'vendor_version',
    'i18n',
    'time',
    'timezone',
  ];

  for (let name of props) {
    meta[name] = envelope[name];
  }
  return meta;
}

export const parse_properties = (element, object = {}) => {
  const copy = {...object, ...element}; // create shallow copy

  copy.id = element._id;

  if (is_defined(element.creation_time)) {
    copy.creation_time = moment(element.creation_time);
  }
  if (is_defined(element.modification_time)) {
    copy.modification_time = moment(element.modification_time);
  }

  if (is_defined(copy.type)) {
    // type should not be used directly
    copy._type = copy.type;
    delete copy.type;
  }

  return copy;
};

export const set_properties = (properties, object = {}) => {
  if (is_defined(properties)) {
    for (const [key, value] of Object.entries(properties)) {
      if (!key.startsWith('_')) {
        Object.defineProperty(object, key, {
          value,
          writable: false,
          enumerable: true,
        });
      }
    }
  }
  return object;
};

export const new_properties = (properties, object = {}) =>
  set_properties(parse_properties(properties, object));

export const parse_cvss_base_vector = ({
  access_complexity,
  access_vector,
  authentication,
  availability_impact,
  confidentiality_impact,
  integrity_impact,
}) => {
  if (!is_defined(access_vector) &&
    !is_defined(access_complexity) &&
    !is_defined(authentication) &&
    !is_defined(confidentiality_impact) &&
    !is_defined(integrity_impact) &&
    !is_defined(availability_impact)) {
    return undefined;
  }

  let vector = 'AV:';

  switch (access_vector) {
    case 'LOCAL':
      vector += 'L';
      break;
    case 'NETWORK':
      vector += 'N';
      break;
    case 'ADJACENT_NETWORK':
      vector += 'A';
      break;
    default:
      vector += 'ERROR';
  }

  vector += '/AC:';
  switch (access_complexity) {
    case 'LOW':
      vector += 'L';
      break;
    case 'MEDIUM':
      vector += 'M';
      break;
    case 'HIGH':
      vector += 'H';
      break;
    default:
      vector += 'ERROR';
  }

  vector += '/Au:';
  switch (authentication) {
    case 'NONE':
      vector += 'N';
      break;
    case 'MULTIPLE_INSTANCES':
      vector += 'M';
      break;
    case 'SINGLE_INSTANCE':
      vector += 'S';
      break;
    default:
      vector += 'ERROR';
  }

  vector += '/C:';
  switch (confidentiality_impact) {
    case 'NONE':
      vector += 'N';
      break;
    case 'PARTIAL':
      vector += 'P';
      break;
    case 'COMPLETE':
      vector += 'C';
      break;
    default:
      vector += 'ERROR';
  }

  vector += '/I:';
  switch (integrity_impact) {
    case 'NONE':
      vector += 'N';
      break;
    case 'PARTIAL':
      vector += 'P';
      break;
    case 'COMPLETE':
      vector += 'C';
      break;
    default:
      vector += 'ERROR';
  }

  vector += '/A:';
  switch (availability_impact) {
    case 'NONE':
      vector += 'N';
      break;
    case 'PARTIAL':
      vector += 'P';
      break;
    case 'COMPLETE':
      vector += 'C';
      break;
    default:
      vector += 'ERROR';
  }
  return vector;
};

// vim: set ts=2 sw=2 tw=80:
