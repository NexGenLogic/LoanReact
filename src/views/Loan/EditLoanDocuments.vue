<template>
  
  <div class="documents-manager">
    <!-- The header for the table -->
    <div class="header">
      <div class="col-serial">#</div>
      <div class="col-type">Type</div>
      <div class="col-doc">File</div>
      <div class="col-notes">Notes</div>
      <div class="col-actions"></div>
    </div>

    <div v-if="localDocuments.length === 0" class="no-documents">
      No documents found. Add one below.
    </div>

    <div class="document-list">
      <div
        v-for="(doc, index) in localDocuments"
        :key="doc.id"
        class="document-row"
        :class="{ 'is-deleted': doc.status === 'deleted' }"
      >
        <div class="col-serial">{{ index + 1 }}</div>

        <div class="col-type">
          <select v-if="doc.status === 'new'" v-model="doc.doc_type" :key="doc.id" class="form-select">
            <option disabled value="">Type...</option>
            <option v-for="type in docTypes" :key="type" :value="type">{{ type }}</option>
          </select>
          <span v-else>{{ doc.doc_type }}</span>
        </div>

        <div class="col-doc">
          <div v-if="doc.public_url || doc.previewUrl" class="doc-icon" title="Click to open" @click="openDocument(doc)">
             <i class="material-icons" style="width:20px;height: 20px;margin:10px">insert_drive_file</i>
          </div>
          <label v-else-if="doc.status === 'new'" :for="`file-upload-${doc.id}`" class="upload-button">
            <i class="material-icons">cloud_upload</i>
            
            <input :id="`file-upload-${doc.id}`" type="file" class="file-input" @change="handleFileChange($event, doc.id)">
          </label>
        </div>

        <!-- Notes Textarea -->
        <div class="col-notes">
          <textarea v-model="doc.notes" class="notes-textarea" placeholder="Notes"></textarea>
        </div>

        <!-- Remove Button -->
        <div class="col-actions">
          <button class="action-button remove-button"  type="button" title="Remove" @click="handleRemoveRow(doc.id)">
            <i class="material-icons">delete</i>
          </button>
        </div>
      </div>
    </div>

    <!-- The main 'Add Document' button at the bottom -->
    <div class="footer-actions">
      <button class="add-document-button" type="button" @click="handleAddRow">
        <i class="material-icons">add</i>
        <span>Add Document</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditLoanDocuments',

  props: {
    documents: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      localDocuments: [],
      docTypes: ['Aadhaar', 'PAN Card', 'Voter\'s ID', 'SSLC Book', 'Driving License', 'Passport'],
    };
  },
  
  watch: {
    documents: {
      handler(newDocs) {
        this.initializeDocuments(newDocs);
      },
      immediate: true, // This ensures the handler runs on component creation
      deep: true,      // This is needed to detect changes within the array
    },
  },

  methods: {
  
    initializeDocuments(docs) {
      if (docs && Array.isArray(docs)) {
        this.localDocuments = docs.map(doc => ({
          id: doc.id,
          doc_type: doc.doc_type,
          notes: doc.notes || '',
          // public_url: doc.public_url || (doc.document ? `/storage/${doc.document}` : null),
          public_url: doc.document ? doc.document : "",
          file: null,
          previewUrl: null,
          status: 'existing',
        }));
      } else {
        this.localDocuments = [];
      }
    },

    handleAddRow() {
      this.localDocuments.push({
        id: `new_${Date.now()}`, // Temporary unique ID
        doc_type: '',
        notes: '',
        public_url: null,
        file: null,
        previewUrl: null,
        status: 'new',
      });
    },

    handleFileChange(event, docId) {
      const file = event.target.files[0];
      if (!file) return;

      const doc = this.localDocuments.find(d => d.id === docId);
      if (doc) {
        doc.file = file;
        doc.previewUrl = URL.createObjectURL(file);
      }
    },

    handleRemoveRow(docId) {
      const docIndex = this.localDocuments.findIndex(d => d.id === docId);
      if (docIndex === -1) return;

      const doc = this.localDocuments[docIndex];
      
      if (doc.status === 'new') {
        this.localDocuments.splice(docIndex, 1);
      } else {
        doc.status = 'deleted';
      }
    },

    /**
     * Opens the document in a new tab.
     */
    openDocument(doc) {
      const url = doc.public_url || doc.previewUrl;
      if (url) {
        window.open(url, '_blank');
      }
    },

    /**
     * Public method to be called by the parent component.
     * In the Options API, all methods are public by default, so no 'expose' is needed.
     */
    getChanges() {
      const changes = {
        new_documents: [],
        deleted_ids: [],
        updated_notes: [],
      };

      for (const doc of this.localDocuments) {
        if (doc.status === 'new' && doc.file && doc.doc_type) {
          changes.new_documents.push({
            type: doc.doc_type,
            file: doc.file,
            notes: doc.notes,
          });
        } else if (doc.status === 'deleted') {
          changes.deleted_ids.push(doc.id);
        } else if (doc.status === 'existing') {
          changes.updated_notes.push({
            id: doc.id,
            notes: doc.notes,
          });
        }
      }
      return changes;
    },
  },
};
</script>

<style scoped>
/* The CSS is exactly the same and does not need to be changed. */
.documents-manager {
  font-family: Arial, sans-serif;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
}
.header, .document-row {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #e0e0e0;
}
.header {
  font-weight: 600;
  background-color: #f1f1f1;
}
.document-row:last-child {
  border-bottom: none;
}
.document-row.is-deleted {
  opacity: 0.5;
  background-color: #fee;
  text-decoration: line-through;
}
.col-serial { flex: 0 0 40px; }
.col-type { flex: 1 1 200px; }
.col-doc { flex: 0 0 100px; text-align: center; }
.col-notes { flex: 2 1 300px; }
.col-actions { flex: 0 0 80px; text-align: center; }
.form-select, .notes-textarea {
  width: 100%;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
.notes-textarea {
  min-height: 40px;
  resize: vertical;
}
.doc-icon {
  color: #007bff;
  cursor: pointer;
  transform: scale(1.2);
}
.file-input {
  display: none;
}
.upload-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  font-size: 14px;
  background-color: #5c6ac4;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  border: none;
}
.action-button {
  border: none;
  background: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
}
.remove-button {
  color: #dc3545;
}
.remove-button:hover {
  background-color: #fbe0e3;
}
.footer-actions {
  padding: 15px;
  background-color: #f1f1f1;
  border-top: 1px solid #e0e0e0;
  text-align: right;
}
.add-document-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}
.no-documents {
  text-align: center;
  padding: 40px;
  color: #888;
}

</style>