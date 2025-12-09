// animations/components/AnimatedDocumentCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography, Chip, IconButton, Button, Tooltip } from '@mui/material';
import {
  CheckCircle,
  Description,
  CloudUpload,
  Visibility,
  Download,
  Delete,
  PictureAsPdf,
  Image as ImageIcon,
} from '@mui/icons-material';
import { documentCardVariants } from '../variants';
import { ANIMATION_CONFIG } from '../config/animationConfig';

const AnimatedDocumentCard = ({
  document,
  uploaded,
  onUpload,
  onView,
  onDownload,
  onDelete,
  index = 0,
}) => {
  const isUploaded = !!uploaded;

  const getFileIcon = (fileType) => {
    if (!fileType) return <Description sx={{ fontSize: 28, color: '#b91c1c' }} />;
    if (fileType.includes('pdf')) return <PictureAsPdf sx={{ fontSize: 28, color: '#ef4444' }} />;
    if (fileType.includes('image')) return <ImageIcon sx={{ fontSize: 28, color: '#3b82f6' }} />;
    return <Description sx={{ fontSize: 28, color: '#64748b' }} />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div
      variants={documentCardVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      custom={index}
      transition={{ delay: index * ANIMATION_CONFIG.stagger.fast }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          borderRadius: 2,
          border: '1px solid',
          borderColor: isUploaded ? '#86efac' : '#e2e8f0',
          bgcolor: isUploaded ? '#f0fdf4' : '#fafafa',
          transition: 'all 0.2s ease',
        }}
      >
        {/* Document Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.1 }}
        >
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isUploaded ? '#dcfce7' : '#fee2e2',
              flexShrink: 0,
            }}
          >
            {isUploaded ? (
              getFileIcon(uploaded.fileType)
            ) : (
              <Description sx={{ fontSize: 28, color: '#b91c1c' }} />
            )}
          </Box>
        </motion.div>

        {/* Document Info */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#1e293b' }}>
              {document.name}
            </Typography>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25, delay: index * 0.05 + 0.2 }}
            >
              <Chip
                size="small"
                icon={
                  isUploaded ? (
                    <CheckCircle sx={{ fontSize: 14 }} />
                  ) : (
                    <Description sx={{ fontSize: 14 }} />
                  )
                }
                label={isUploaded ? 'UPLOADED' : 'PENDING'}
                sx={{
                  height: 22,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: isUploaded ? '#dcfce7' : '#fef3c7',
                  color: isUploaded ? '#16a34a' : '#d97706',
                  '& .MuiChip-icon': {
                    color: isUploaded ? '#16a34a' : '#d97706',
                  },
                }}
              />
            </motion.div>
          </Box>

          {isUploaded ? (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 + 0.3 }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#64748b',
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  📄 {uploaded.fileName}
                </Typography>
                {uploaded.fileSize > 0 && (
                  <>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      •
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {formatFileSize(uploaded.fileSize)}
                    </Typography>
                  </>
                )}
                {uploaded.uploadedAt && (
                  <>
                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                      •
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#16a34a' }}>
                      ✓ {formatDate(uploaded.uploadedAt)}
                    </Typography>
                  </>
                )}
              </Box>
            </motion.div>
          ) : (
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Click upload to add this document
            </Typography>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
          {isUploaded && (
            <>
              <Tooltip title="View document">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <IconButton
                    size="small"
                    onClick={() => onView?.(document)}
                    sx={{ color: '#3b82f6', '&:hover': { bgcolor: '#eff6ff' } }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                </motion.div>
              </Tooltip>
              <Tooltip title="Download">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <IconButton
                    size="small"
                    onClick={() => onDownload?.(document)}
                    sx={{ color: '#8b5cf6', '&:hover': { bgcolor: '#f5f3ff' } }}
                  >
                    <Download fontSize="small" />
                  </IconButton>
                </motion.div>
              </Tooltip>
              <Tooltip title="Delete">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <IconButton
                    size="small"
                    onClick={() => onDelete?.(document)}
                    sx={{ color: '#ef4444', '&:hover': { bgcolor: '#fef2f2' } }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </motion.div>
              </Tooltip>
            </>
          )}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant={isUploaded ? 'outlined' : 'contained'}
              size="small"
              onClick={() => onUpload?.(document)}
              startIcon={<CloudUpload />}
              sx={{
                ml: 1,
                minWidth: 100,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                ...(isUploaded
                  ? {
                      borderColor: '#16a34a',
                      color: '#16a34a',
                      '&:hover': { borderColor: '#15803d', bgcolor: '#f0fdf4' },
                    }
                  : {
                      bgcolor: '#b91c1c',
                      '&:hover': { bgcolor: '#991b1b' },
                    }),
              }}
            >
              {isUploaded ? 'Replace' : 'Upload'}
            </Button>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
};

export default AnimatedDocumentCard;