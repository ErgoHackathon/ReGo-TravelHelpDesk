import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper
} from '@mui/material';
import { staggerContainer, tableRowVariants } from '../variants';

const AnimatedTableRow = motion.create(TableRow);

const AnimatedTable = ({
  columns,
  data,
  renderRow,
  sx = {},
  ...props
}) => {
  return (
    <TableContainer component={Paper} sx={{ overflow: 'hidden', ...sx }} {...props}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column, index) => (
              <TableCell
                key={index}
                sx={{
                  fontWeight: 600,
                  backgroundColor: 'rgba(185, 28, 28, 0.05)',
                  borderBottom: '2px solid #b91c1c'
                }}
              >
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <motion.tbody
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence>
            {data.map((row, index) => (
              <AnimatedTableRow
                key={row.id || index}
                variants={tableRowVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                exit={{ opacity: 0, x: -30 }}
                layout
                sx={{
                  cursor: 'pointer',
                  '&:last-child td': { border: 0 }
                }}
              >
                {renderRow(row, index)}
              </AnimatedTableRow>
            ))}
          </AnimatePresence>
        </motion.tbody>
      </Table>
    </TableContainer>
  );
};

export default AnimatedTable;