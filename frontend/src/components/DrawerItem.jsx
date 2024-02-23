import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from 'react-router-dom';

export default function DrawerItem({ children, itemLink, itemText, onClick, afterText }) {
  return (
    <ListItemButton onClick={onClick} LinkComponent={Link} to={itemLink}>
      <ListItemIcon>{children}</ListItemIcon>
      <ListItemText primary={itemText} />
      {afterText}
    </ListItemButton>
  );
}
