/* Copyright (C) 2019 Greenbone Networks GmbH
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
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

import React from 'react';

import {
  render,
  fireEvent,
  queryAllByTestId,
  getByTestId,
} from 'web/utils/testing';

import TaskTrendGroup from 'web/components/powerfilter/tasktrendgroup';
import Filter from 'gmp/models/filter';

const openSelectElement = element => {
  const openButton = getByTestId(element, 'select-open-button');
  fireEvent.click(openButton);
};

const getItemElements = baseElement => {
  const portal = baseElement.querySelector('#portals');
  return queryAllByTestId(portal, 'select-item');
};

describe('Task Trend Selector Tests', () => {
  test('should render', () => {
    const onChange = jest.fn();
    const filter = Filter.fromString('trend=down');
    const {element} = render(
      <TaskTrendGroup filter={filter} onChange={onChange} />,
    );

    expect(element).toMatchSnapshot();
  });

  test('should return items', () => {
    const onChange = jest.fn();
    const filter = Filter.fromString('trend=down');
    const {element, baseElement} = render(
      <TaskTrendGroup filter={filter} onChange={onChange} />,
    );

    let domItems = getItemElements(baseElement);

    expect(domItems.length).toEqual(0);

    openSelectElement(element);

    domItems = getItemElements(baseElement);

    expect(domItems.length).toEqual(5);
    expect(domItems[0]).toHaveTextContent('Up');
    expect(domItems[1]).toHaveTextContent('Down');
    expect(domItems[2]).toHaveTextContent('More');
  });

  test('should parse filter', () => {
    const onChange = jest.fn();
    const filter = Filter.fromString('trend=same');
    // eslint-disable-next-line no-shadow
    const {getByTestId} = render(
      <TaskTrendGroup filter={filter} onChange={onChange} />,
    );

    const displayedValue = getByTestId('select-selected-value');
    expect(displayedValue).toHaveTextContent('Same');
  });

  test('should call onChange handler', () => {
    const onChange = jest.fn();
    const filter = Filter.fromString('trend=down');
    const {element, baseElement} = render(
      <TaskTrendGroup filter={filter} onChange={onChange} />,
    );

    openSelectElement(element);

    const domItems = getItemElements(baseElement);

    fireEvent.click(domItems[0]);

    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith('up', 'trend');
  });
  test('should change value', () => {
    const onChange = jest.fn();
    const filter = Filter.fromString('trend=down');

    // eslint-disable-next-line no-shadow
    const {baseElement, element, getByTestId} = render(
      <TaskTrendGroup trend="up" filter={filter} onChange={onChange} />,
    );

    const displayedValue = getByTestId('select-selected-value');
    expect(displayedValue).toHaveTextContent('Up');

    openSelectElement(element);

    const domItems = getItemElements(baseElement);

    fireEvent.click(domItems[2]);

    expect(onChange).toBeCalled();
    expect(onChange).toBeCalledWith('more', 'trend');
  });
});
