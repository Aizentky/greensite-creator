
insert into storage.buckets (id, name, public) values ('client-files', 'client-files', true);

create policy "Public read client-files" on storage.objects for select using (bucket_id = 'client-files');
create policy "Public upload client-files" on storage.objects for insert with check (bucket_id = 'client-files');
create policy "Public update client-files" on storage.objects for update using (bucket_id = 'client-files');
create policy "Public delete client-files" on storage.objects for delete using (bucket_id = 'client-files');
