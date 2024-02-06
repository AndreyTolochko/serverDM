import React from 'react';
import { Box, Link } from '@admin-bro/design-system';
import AdminBro from 'admin-bro';
import { unflatten } from 'flat';

export const ArcansShow = (props) => {
  const { record, property } = props;
  const populated = unflatten(record.populated);

  if (!populated[property.name].length) {
    return (
      <Box>
        No related Arcans found.
      </Box>
    );
  }

  return (
    <Box>
      {populated[property.name].map(arcan => (
        <Box key={arcan.id}>
          <Link href={AdminBro.router.page.show('Arcans', arcan.id)}>
            {arcan.title}
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export default ArcansShow; // This is how you should export your component in CommonJS syntax
