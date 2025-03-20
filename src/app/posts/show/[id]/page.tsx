"use client";
import {
  useShow,
  useList,
  useCreate,
  useUpdate,
  useDelete,
} from "@refinedev/core";
import {
  Show,
  NumberField,
  DateField,
  TextFieldComponent as TextField,
} from "@refinedev/mui";
import {
  Typography,
  Stack,
  TextField as MuiTextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useState } from "react";

export default function PostShow() {
  const { query } = useShow();
  const { data, isLoading } = query;
  const record = data?.data;

  // 会話リスト取得
  const { data: talksData, refetch } = useList({
    resource: "talks",
    filters: [{ field: "post_id", operator: "eq", value: record?.id }],
  });

  // 投稿・編集・削除処理
  const { mutate: createTalk } = useCreate();
  const { mutate: updateTalk } = useUpdate();
  const { mutate: deleteTalk } = useDelete();

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [editId, setEditId] = useState(null);

  const handlePostTalk = () => {
    if (editId) {
      updateTalk(
        {
          resource: "talks",
          id: editId,
          values: { name, message },
        },
        {
          onSuccess: () => {
            setName("");
            setMessage("");
            setEditId(null);
            refetch();
          },
        }
      );
    } else {
      createTalk(
        {
          resource: "talks",
          values: { name, message, post_id: record?.id },
        },
        {
          onSuccess: () => {
            setName("");
            setMessage("");
            refetch();
          },
        }
      );
    }
  };

  const handleEdit = (talk) => {
    setName(talk.name);
    setMessage(talk.message);
    setEditId(talk.id);
  };

  const handleDelete = (id) => {
    deleteTalk({ resource: "talks", id }, { onSuccess: refetch });
  };

  return (
    <Show isLoading={isLoading}>
      <Stack gap={2}>
        <Typography variant="body1" fontWeight="bold">
          Id
        </Typography>
        <NumberField value={record?.id ?? ""} />
        <Typography variant="body1" fontWeight="bold">
          Created At
        </Typography>
        <DateField value={record?.created_at} />
        <Typography variant="body1" fontWeight="bold">
          Content
        </Typography>
        <TextField value={record?.content} />
        <Typography variant="body1" fontWeight="bold">
          Title
        </Typography>
        <TextField value={record?.title} />
      </Stack>

      {/* 会話リスト */}
      <Typography variant="h6" sx={{ mt: 3 }}>
        会話一覧
      </Typography>
      <List>
        {talksData?.data?.map((talk) => (
          <ListItem
            key={talk.id}
            secondaryAction={
              <>
                <IconButton
                  edge="end"
                  aria-label="edit"
                  onClick={() => handleEdit(talk)}
                >
                  <Edit />
                </IconButton>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleDelete(talk.id)}
                >
                  <Delete />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={`${talk.name}: ${talk.message}`} />
          </ListItem>
        ))}
      </List>

      {/* 会話投稿フォーム */}
      <Stack spacing={2} sx={{ mt: 3 }}>
        <MuiTextField
          label="名前"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
        />
        <MuiTextField
          label="会話"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
        <Button variant="contained" onClick={handlePostTalk}>
          {editId ? "更新" : "投稿"}
        </Button>
      </Stack>
    </Show>
  );
}
