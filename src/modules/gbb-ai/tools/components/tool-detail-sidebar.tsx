import { useSnackbar } from 'notistack';
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import cloudUploadFill from '@iconify/icons-eva/cloud-upload-fill';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import Drawer, { DrawerProps } from '@mui/material/Drawer';

import { useBoolean } from 'src/hooks/use-boolean';

import { deleteTool } from 'src/api/tool';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { CustomFile } from 'src/components/upload';
import { ConfirmDialog } from 'src/components/custom-dialog';

import { ITool } from 'src/types/tool';

import FileManagerInvitedItem from './tool-detail-access-item';
import ToolAccessControlDialog from './tool-detail-access-control';
// ----------------------------------------------------------------------

type Props = DrawerProps & {
  item: ITool;
  //
  onClose: VoidFunction;
  // onDelete: VoidFunction;
  setValue?: (name: keyof ITool, value: any) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
};

export default function ToolDetailSidebar({ item, open, onClose, setValue, onSubmit, isSubmitting, ...other }: Props) {
  const { name, cover, shared, description, id } = item;

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const confirm = useBoolean();

  const hasShared = shared && !!shared.length;

  const toggleTags = useBoolean(true);

  const toggleStatus = useBoolean(true);

  const access = useBoolean();

  const properties = useBoolean(true);

  const [inviteEmail, setInviteEmail] = useState('');

  const [tags, setTags] = useState(item.tags.slice(0, 3));

  const [status, setStatus] = useState(item.status.slice(0, 10) || 'draft');

  const [deleting, setDeleting] = useState(false);

  const parsedCover = typeof cover === 'string' ? cover : `${(cover as CustomFile)?.preview}`;

  const handleChangeInvite = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(event.target.value);
  }, []);

  const handleChangeTags = useCallback((newValue: string[]) => {
    setTags(newValue);
    setValue?.('tags', newValue);
  }, [setValue]);

  const handleChangeStatus = useCallback((newValue: string) => {
    setStatus(newValue);
    setValue?.('status', newValue);
  }, [setValue]);

  // const handleDeleteTool = useCallback(async () => {
  //   try {
  //     setDeleting(true); // 開始刪除時設置 loading 狀態為 true
  //     const res = await deleteTool(id); // 調用 deleteTool API，傳入當前 Tool 的 id
  //     setDeleting(false); // 刪除完成後設置 loading 狀態為 false

  //     if (res && res.success) {
  //       enqueueSnackbar('Tool deleted successfully'); // 顯示成功訊息
  //       onClose(); // 關閉側邊欄
  //       // 此處不需要額外通知 ToolRegistry 刷新，因為 ToolRegistry 應該已經監聽了數據變化或有自己的刷新機制
  //     } else if (res && !res.success) {
  //       enqueueSnackbar(res.message, { variant: 'error' }); // 顯示錯誤訊息
  //     }
  //   } catch (error) {
  //     setDeleting(false); // 發生錯誤時設置 loading 狀態為 false
  //     console.error(error);
  //     enqueueSnackbar('An error occurred while deleting the tool', { variant: 'error' }); // 顯示通用錯誤訊息
  //   }
  // }, [id, enqueueSnackbar, onClose]);

  const renderTags = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Tags
        <IconButton size="small" onClick={toggleTags.onToggle}>
          <Iconify
            icon={toggleTags.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {toggleTags.value && (
        <Autocomplete
          multiple
          freeSolo
          options={item.tags.map((option) => option)}
          getOptionLabel={(option) => option}
          defaultValue={item.tags.slice(0, 3)}
          value={tags}
          onChange={(event, newValue) => {
            handleChangeTags(newValue);
          }}
          renderOption={(props, option) => (
            <li {...props} key={option}>
              {option}
            </li>
          )}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => (
              <Chip
                {...getTagProps({ index })}
                size="small"
                variant="soft"
                label={option}
                key={option}
              />
            ))
          }
          renderInput={(params) => <TextField {...params} placeholder="Add tags" />}
        />
      )}
    </Stack>
  );

  // Status
  const renderStatus = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Status
        <IconButton size="small" onClick={toggleStatus.onToggle}>
          <Iconify
            icon={toggleStatus.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>
      {toggleStatus.value && (
        <Autocomplete
          disablePortal
          disableClearable

          options={['published', 'draft']}
          value={status}
          onChange={(event, newValue) => {
            if (newValue !== null) {
              handleChangeStatus(newValue);
            }
          }}
          renderInput={(params) => <TextField {...params} placeholder="Select status" />}
        />
      )}
    </Stack>
  );

  const renderProperties = (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ typography: 'subtitle2' }}
      >
        Properties
        <IconButton size="small" onClick={properties.onToggle}>
          <Iconify
            icon={properties.value ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        </IconButton>
      </Stack>

      {properties.value && (
        <Stack direction="row" sx={{ typography: 'caption', textTransform: 'capitalize' }}>
          <Box component="span" sx={{ width: 100, color: 'text.secondary', mr: 2 }}>
            Description
          </Box>
          {description}
        </Stack>
      )}
    </Stack>
  );

  const accessPanel = (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ p: 2.5, py: 1.5 }}
      >
        <Typography variant="subtitle2" textTransform="capitalize">
          Manage Access
        </Typography>

        <IconButton size="small" onClick={access.onTrue} sx={{ p: 0.25 }}>
          <Box
            component="img"
            src="/assets/icons/modules/ic_manage_access.svg"
            sx={{ width: 26, height: 26, cursor: 'pointer' }}
          />
        </IconButton>
      </Stack>

      {hasShared && (
        <Box sx={{ pl: 2.5, pr: 1 }}>
          {shared.map((person) => (
            <FileManagerInvitedItem key={person.id} person={person} />
          ))}
        </Box>
      )}
    </>
  );

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        anchor="right"
        slotProps={{ backdrop: { invisible: true } }}
        PaperProps={{ sx: { width: 320 } }}
        {...other}
      >
        <Scrollbar sx={{ height: 1 }}>
          <Stack
            spacing={2.5}
            justifyContent="center"
            sx={{ p: 2.5, bgcolor: 'background.neutral' }}
          >
            <Stack direction="row" alignItems="center">
              <Avatar
                src={parsedCover}
                alt={name}
                sx={{ width: 42, height: 42, borderRadius: 1, mr: 2 }}
              >
                {name.charAt(0).toUpperCase() || ''}
              </Avatar>

              <Typography variant="subtitle1" sx={{ wordBreak: 'break-all' }}>
                {name}
              </Typography>
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            {renderTags}
            {renderStatus}
            {renderProperties}
          </Stack>

          {accessPanel}
        </Scrollbar>

        <Stack sx={{ p: 2 }} direction="row" spacing={1.5}>
          <LoadingButton
            fullWidth
            loading={isSubmitting}
            variant="soft"
            color="success"
            size="medium"
            startIcon={<Iconify icon={cloudUploadFill} />}
            onClick={onSubmit}
            sx={{ height: 38 }}
          >
            Update
          </LoadingButton>
          <LoadingButton
            fullWidth
            variant="soft"
            color="error"
            size="medium"
            startIcon={<Iconify icon="gravity-ui:trash-bin" width={18} />}
            onClick={confirm.onTrue}
            loading={deleting}
          >
            Delete
          </LoadingButton>
        </Stack>
      </Drawer>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete?"
        content={<>Are you sure you want to delete this tool?</>}
        action={
          <LoadingButton
            variant="contained"
            loading={deleting}
            color="error"
            onClick={async () => {
              try {
                setDeleting(true);
                const res = await deleteTool(id);
                setDeleting(false);

                if (res && res.success) {
                  enqueueSnackbar('Tool deleted successfully');
                  onClose();
                  navigate('/tool-list-page');
                } else if (res && !res.success) {
                  enqueueSnackbar(res.message, { variant: 'error' });
                }
              } catch (error) {
                setDeleting(false);
                console.error(error);
                enqueueSnackbar('An error occurred while deleting the tool', { variant: 'error' });
              }
            }}
          >
            Delete
          </LoadingButton>
        }
      />

      <ToolAccessControlDialog
        open={access.value}
        shared={shared}
        inviteEmail={inviteEmail}
        onChangeInvite={handleChangeInvite}
        onClose={() => access.onFalse()}
      />
    </>
  );
}
