import http from '@/axios/index.js';

export function draftList(draftId = 0, size = 50) {
  return http.get('/draft/list', {
    params: { draftId, size },
    noMsg: true,
  });
}

export function draftSave(form) {
  return http.post('/draft/save', form, { noMsg: true });
}

export function draftDelete(draftIds) {
  return http.delete('/draft/delete?draftIds=' + draftIds.join(','));
}
