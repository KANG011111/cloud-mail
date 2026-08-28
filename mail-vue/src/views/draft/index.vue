<template>
  <emailScroll ref="scroll"
               :allow-star="false"
               :getEmailList="getEmailList"
               :star-add="starAdd"
               :star-cancel="starCancel"
               @jump="jumpContent"
               actionLeft="6px"
               :show-account-icon="false"
               :show-first-loading="false"
               :showStar="false"
               @delete-draft="deleteDraft"
               :type="'draft'"
  >
    <template #name="props">
      <span class="send-email">{{ props.email.receiveEmail?.join(',') || '(' + $t('noRecipient') + ')' }}</span>
    </template>
    <template #subject="props">
      {{ props.email.subject || '(' + $t('noSubject') + ')' }}
    </template>
  </emailScroll>
</template>

<script setup>
import emailScroll from "@/components/email-scroll/index.vue"
import {starAdd, starCancel} from "@/request/star.js";
import {ref, watch} from "vue";
import {useUiStore} from "@/store/ui.js";
import {userDraftStore} from "@/store/draft.js";
import {draftDelete, draftList} from "@/request/draft.js";

const draftStore = userDraftStore();
const uiStore = useUiStore();
const scroll = ref({})

watch(() => draftStore.refreshList, () => {
  scroll.value.refreshList()
})

function getEmailList(draftId = 0, size = 50) {
  return draftList(draftId, size);
}

async function deleteDraft(draftIds) {
  await draftDelete(draftIds);
  draftStore.refreshList++;
}

function jumpContent(draft) {
  uiStore.writerRef.openDraft(draft);
}

</script>
<style>
.send-email {
  font-weight: normal;
}
</style>
