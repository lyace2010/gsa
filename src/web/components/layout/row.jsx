/* SPDX-FileCopyrightText: 2024 Greenbone AG
 *
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import {Flex} from '@mantine/core';

import PropTypes from 'web/utils/proptypes';

/**
 * React component that renders a row layout
 *
 */
const Row = ({
  children,
  gap = 'md',
  grow,
  align = 'center',
  wrap,
  justify,
  ...props
}) => {
  return (
    <Flex
      {...props}
      direction="row"
      gap={gap}
      grow={grow}
      align={align}
      wrap={wrap}
      justify={justify}
    >
      {children}
    </Flex>
  );
};

Row.propTypes = {
  align: PropTypes.string,
  gap: PropTypes.string,
  grow: PropTypes.numberOrNumberString,
  justify: PropTypes.string,
  wrap: PropTypes.string,
};

export default Row;
