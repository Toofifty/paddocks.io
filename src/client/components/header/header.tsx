import { Title } from '@mantine/core';
import { NavLink } from 'react-router-dom';

export const Header = () => (
  <Title order={1}>
    <NavLink to="/" style={{ textDecoration: 'none', color: 'black' }}>
      - Super Paddocks -
    </NavLink>
  </Title>
);
