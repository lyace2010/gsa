import GmpSettings from 'gmp/gmpsettings';

/* Greenbone Security Assistant
 *
 * Authors:
 * Björn Ricks <bjoern.ricks@greenbone.net>
 *
 * Copyright:
 * Copyright (C) 2018 Greenbone Networks GmbH
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
const createStorage = state => {
  const store = {
    ...state,
    setItem: jest.fn((name, value) => store[name] = value),
    removeItem: jest.fn(name => delete store[name]),
  };
  return store;
};

describe('GmpSettings tests', () => {

  test('should init with passed options', () => {
    const storage = createStorage();
    const settings = new GmpSettings(storage, {
      autorefresh: 10,
      locale: 'en',
      manualurl: 'http://manual',
      protocol: 'http',
      protocoldocurl: 'http://protocol',
      server: 'localhost',
      token: 'atoken',
      timeout: 30000,
      timezone: 'cet',
      username: 'foo',
    });

    expect(settings.autorefresh).toEqual(10);
    expect(settings.locale).toEqual('en');
    expect(settings.manualurl).toEqual('http://manual');
    expect(settings.protocol).toEqual('http');
    expect(settings.protocoldocurl).toEqual('http://protocol');
    expect(settings.server).toEqual('localhost');
    expect(settings.token).toEqual('atoken');
    expect(settings.timeout).toEqual(30000);
    expect(settings.timezone).toEqual('cet');
    expect(settings.username).toEqual('foo');

    expect(storage.setItem).toHaveBeenCalledTimes(4);
    expect(storage.setItem).toHaveBeenCalledWith('locale', 'en');
    expect(storage.setItem).toHaveBeenCalledWith('token', 'atoken');
    expect(storage.setItem).toHaveBeenCalledWith('timezone', 'cet');
    expect(storage.setItem).toHaveBeenCalledWith('username', 'foo');
  });

  test('should init from store', () => {
    const storage = createStorage({
      locale: 'en',
      token: 'atoken',
      timezone: 'cet',
      username: 'foo',
    });

    const settings = new GmpSettings(storage, {
      // pass server and protocol. location defaults may not reliable on
      // different test environments
      server: 'foo',
      protocol: 'http',
    });

    expect(settings.autorefresh).toBeUndefined();
    expect(settings.locale).toEqual('en');
    expect(settings.manualurl).toBeUndefined();
    expect(settings.protocol).toEqual('http');
    expect(settings.protocoldocurl).toBeUndefined();
    expect(settings.server).toEqual('foo');
    expect(settings.token).toEqual('atoken');
    expect(settings.timeout).toBeUndefined();
    expect(settings.timezone).toEqual('cet');
    expect(settings.username).toEqual('foo');

    expect(storage.setItem).toHaveBeenCalledTimes(4);
    expect(storage.setItem).toHaveBeenCalledWith('locale', 'en');
    expect(storage.setItem).toHaveBeenCalledWith('token', 'atoken');
    expect(storage.setItem).toHaveBeenCalledWith('timezone', 'cet');
    expect(storage.setItem).toHaveBeenCalledWith('username', 'foo');
  });

  test('should ensure options override settings from storage', () => {
    const storage = createStorage({
      autorefresh: 20,
      locale: 'de',
      manualurl: 'http://ipsum',
      protocol: 'https',
      protocoldocurl: 'http://lorem',
      server: 'foo.bar',
      token: 'btoken',
      timeout: 10000,
      timezone: 'cest',
      username: 'bar',
    });

    const settings = new GmpSettings(storage, {
      autorefresh: 10,
      locale: 'en',
      manualurl: 'http://manual',
      protocol: 'http',
      protocoldocurl: 'http://protocol',
      server: 'localhost',
      token: 'atoken',
      timeout: 30000,
      timezone: 'cet',
      username: 'foo',
    });

    expect(settings.autorefresh).toEqual(10);
    expect(settings.locale).toEqual('en');
    expect(settings.manualurl).toEqual('http://manual');
    expect(settings.protocol).toEqual('http');
    expect(settings.protocoldocurl).toEqual('http://protocol');
    expect(settings.server).toEqual('localhost');
    expect(settings.token).toEqual('atoken');
    expect(settings.timeout).toEqual(30000);
    expect(settings.timezone).toEqual('cet');
    expect(settings.username).toEqual('foo');

    expect(storage.setItem).toHaveBeenCalledTimes(4);
    expect(storage.setItem).toHaveBeenCalledWith('locale', 'en');
    expect(storage.setItem).toHaveBeenCalledWith('token', 'atoken');
    expect(storage.setItem).toHaveBeenCalledWith('timezone', 'cet');
    expect(storage.setItem).toHaveBeenCalledWith('username', 'foo');
  });

  test('should delete settings from storage', () => {
    const storage = createStorage({
      locale: 'en',
      token: 'atoken',
      timezone: 'cet',
      username: 'foo',
    });

    const settings = new GmpSettings(storage, {});

    expect(settings.locale).toEqual('en');
    expect(settings.token).toEqual('atoken');
    expect(settings.timezone).toEqual('cet');
    expect(settings.username).toEqual('foo');

    expect(storage.setItem).toHaveBeenCalledTimes(4);
    expect(storage.setItem).toHaveBeenCalledWith('locale', 'en');
    expect(storage.setItem).toHaveBeenCalledWith('token', 'atoken');
    expect(storage.setItem).toHaveBeenCalledWith('timezone', 'cet');
    expect(storage.setItem).toHaveBeenCalledWith('username', 'foo');

    settings.locale = undefined;
    expect(storage.removeItem).toBeCalledWith('locale');

    settings.token = undefined;
    expect(storage.removeItem).toBeCalledWith('token');

    settings.timezone = undefined;
    expect(storage.removeItem).toBeCalledWith('timezone');

    settings.username = undefined;
    expect(storage.removeItem).toBeCalledWith('username');
  });

});

// vim: set ts=2 sw=2 tw=80: