import { Box, Link } from '@adminjs/design-system';
import { unflatten } from 'flat';


const ArcansList = (props) => {
  const { record, property } = props;
  const populated = unflatten(record.populated);

  const categoryId = record.params._id;
  const arcansCount = populated[property.name]?.length || 0;

  return (
    <Box>
      <Link to={{ resource: 'Arcans', search: `category=${categoryId}` }}>
        {arcansCount} Arcans
      </Link>
    </Box>
  );
};

export default ArcansList;
