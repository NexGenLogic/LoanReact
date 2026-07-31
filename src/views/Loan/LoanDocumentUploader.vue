<!-- LoanDocumentUploader.vue -->
<template>

  <form @submit.prevent="handleSave">
    <table class="document-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Document Type</th>
          <th>File</th>
          <th>Note</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(doc, idx) in documentRows" :key="doc.id" :class="{ 'marked-for-deletion': doc._deleted }">
          <td>{{ idx + 1 }} </td>
          <td>
            <select v-model="doc.doc_type" class="form-select">
              <option disabled value="">Select a document</option>
              <option v-for="docType in docTypes" :key="docType.id" :value="docType.name">
                {{ docType.name }}
              </option>
            </select>
          </td>
          <td>
            <!-- <div v-if="!doc.file">

              <label class="upload-label" :for="`doc-upload-${doc.id}`" title="Upload file">
                <i class="material-icons bg-gradient-dark ">cloud_upload</i>
              </label>
              <input :id="`doc-upload-${doc.id}`" type="file" @change="handleFileUpload($event, idx)"
                style="display:none" />
            </div>
            <div v-else class="file-actions">
              <span class="material-icons file-icon" @click="previewDocument(doc)" title="Preview"
                style="cursor:pointer;">description</span>
              <span class="remove-button" @click="removeFile(idx)" title="Remove">
                <span class="material-icons" style="color:#c00;cursor:pointer;font-size:21px;">clear</span>
              </span>
            </div> -->
          
          <!-- Case 1: Existing Document (no new file selected) -->
    <div v-if="doc.document && !doc.file" class="file-actions">
      <a :href="doc.document" target="_blank" title="Download/Preview Existing">
        <span class="material-icons file-icon">visibility</span>
      </a>
      <!-- This button now triggers a file replacement -->
      <label :for="`doc-upload-${doc.id}`" title="Replace file" style="cursor:pointer;">
        <i class="material-icons">upload_file</i>
      </label>
      <input :id="`doc-upload-${doc.id}`" type="file" @change="handleFileUpload($event, idx)" style="display:none" />
    </div>

    <!-- Case 2: New File Selected (for a new or existing row) -->
    <div v-else-if="doc.file" class="file-actions">
      <span @click="previewDocument(doc)" title="Preview New File" style="cursor:pointer;">
        <i class="material-icons file-icon">description</i>
      </span>
      <span @click="removeFile(idx)" title="Clear Selection">
         <span class="material-icons" style="color:#c00;cursor:pointer;font-size:21px;">backspace</span>
      </span>
    </div>

    <!-- Case 3: New Row, No File Selected -->
    <div v-else>
      <label class="upload-label" :for="`doc-upload-${doc.id}`" title="Upload file">
        <i class="material-icons ">cloud_upload</i>
      </label>
      <input :id="`doc-upload-${doc.id}`" type="file" @change="handleFileUpload($event, idx)" style="display:none" />
    </div>
          </td>
          <td>
            <textarea placeholder="Note"
              style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 6px; resize: vertical;"
              rows="2" v-model="doc.notes"></textarea>
          </td>
          <td class="actions-cell"> <!-- Added a class for better styling if needed -->
  <!-- The delete icon remains the same -->
  <span @click="deleteRow(idx)" class="material-icons" style="cursor:pointer;color:red;" title="Delete Row">delete</span>
  
  <!-- This condition is now correct -->
  <span v-if="doc === visibleDocumentRows[visibleDocumentRows.length - 1]"
        @click="addDocumentRow" 
        class="material-icons add-row" 
        style="cursor:pointer;color:#007bff;" 
        title="Add Row">
    add_circle_outline
  </span>
</td>

        </tr>
      </tbody>
    </table>
    <div v-html="error_html">

    </div>
    <div class="button-row d-flex mt-4" v-if="is_allowed('loans','update')">

      <material-button type="submit" color="dark" variant="gradient" class="ms-auto mb-0 js-btn-next" full-width>
        <span v-if="loading == false">Upload Documents</span>
        <PulseLoader v-if="loading" text="Saving" />
      </material-button>




    </div>

  </form>
</template>

<script>
import docTypesData from '@/assets/doc_types.json';
import MaterialButton from "@/components/MaterialButton.vue";
import { storeLoanDocuments, fetchLoanById } from "@/utils/loan_services";
import PulseLoader from "../PulseLoader.vue";
import showSwal from "@/mixins/showSwal.js";
import { is_allowed } from "@/utils/api_services"; 

export default {
  name: "LoanDocumentUploader",
  components: {
    MaterialButton,
    PulseLoader
  },
  props: {
    loanId: {
      type: Number,
      required: true
    }
  },
  watch: {
    loanId: {
      // This handler will now run immediately when the component is mounted
      handler(newId) {
        if (newId) {
          this.loadDocumentsForLoan(newId);
        }
      },
      immediate: true // This is the crucial part you are missing
    }
  },
  data() {
    return {

      error_html: "",
      docTypes: [],
      documentRows: [
        { id: Date.now(), doc_type: "", file: null, filename: null }
      ],
      loading: false
    };
  },
  computed: {
    documentTypeOptions() {
      return this.documentTypes;
    },
    visibleDocumentRows() {
      // This will return a new array containing only the rows that are not deleted
      return this.documentRows.filter(doc => !doc._deleted);
    }
  },
  mounted() {
    this.docTypes = docTypesData;
    if (!this.loanId) {
      // If creating a new loan, start with one empty row
      this.addDocumentRow();
    }

  },
  methods: {
    is_allowed,
    async loadDocumentsForLoan(loanId) {
      try {
        const response = await fetchLoanById(loanId);
        const existingDocs = response.data.data.loan_docs;
        this.documentRows = existingDocs.map(doc => ({
          id: doc.id, // Use a unique key
          db_id: doc.id,
          doc_type: doc.doc_type,
          notes: doc.notes,
          file: null,
          document: doc.document, // Assuming your API provides a URL
          _deleted: false,
        }));

        // Optionally, add one empty row for new uploads
        this.addDocumentRow();
      } catch (error) {
        console.error(error)
      }
    },
    addDocumentRow() {
      this.documentRows.push({
        id: Date.now() + Math.random(),
        db_id: null,
        doc_type: "",
        file: null,
        notes: "",
        filename: null,
        document: null,
        _deleted: false,
      });
    },
    deleteRow(idx) {
  const doc = this.documentRows[idx];
  if (doc.db_id) {
    // It's an existing document. Toggle its deletion status.
    this.documentRows[idx]._deleted = !this.documentRows[idx]._deleted;
  } else {
    // It's a new, unsaved row, so just remove it from the array instantly.
    this.documentRows.splice(idx, 1);
  }
},
    handleFileUpload(event, idx) {
      const file = event.target.files[0];
      if (file) {
        this.documentRows[idx].file = file;
        this.documentRows[idx].filename = file.name;
      }
      event.target.value = ""; // clear for potential re-upload
    },
    removeFile(idx) {
      this.documentRows[idx].file = null;
      this.documentRows[idx].filename = null;
    },
 previewDocument(doc) {
      if (doc.file) {
        // Preview a new local file
        const fileReader = new FileReader();
        fileReader.onload = () => { window.open(fileReader.result, "_blank"); };
        fileReader.readAsDataURL(doc.file);
      } else if (doc.document) {
        // Open the URL of an existing file
        window.open(doc.document, "_blank");
      }
    },
    async handleSave() {
      this.loading = true;
      this.error_html= "";
      try {
        const formData = new FormData();
        
        const newDocuments = this.documentRows.filter(doc => !doc.db_id && doc.file);
        const updatedDocuments = this.documentRows.filter(doc => doc.db_id && !doc._deleted);
        const deletedDocumentIds = this.documentRows.filter(doc => doc._deleted && doc.db_id).map(doc => doc.db_id);

        // Append new documents
        newDocuments.forEach((doc, index) => {
          formData.append(`documents[new][${index}][doc_type]`, doc.doc_type);
          formData.append(`documents[new][${index}][notes]`, doc.notes || '');
          formData.append(`documents[new][${index}][file]`, doc.file);
        });

        // Append updated documents (notes and replacement files)
        updatedDocuments.forEach((doc, index) => {
          formData.append(`documents[updated][${index}][id]`, doc.db_id);
          formData.append(`documents[updated][${index}][doc_type]`, doc.doc_type);
          formData.append(`documents[updated][${index}][notes]`, doc.notes || '');
          if (doc.file) {
            formData.append(`documents[updated][${index}][file]`, doc.file);
          }
        });

        // Append IDs of documents to delete
        deletedDocumentIds.forEach((id, index) => {
          formData.append(`documents[deleted][${index}]`, id);
        });
        
        if (this.loanId) {
          // You might need a new API endpoint for this complex update
          await storeLoanDocuments(formData, this.loanId);
          showSwal.methods.showSwal({ type: "success", message: "Documents saved successfully!" });
          this.loadDocumentsForLoan(this.loanId); // Reload the list
        } else {
          throw new Error("Loan ID is missing");
        }
      } catch (error) {
        let errorMessage = "Failed to store docs. Please try again.";
          if(error.html) {
            errorMessage = error.html
          }
          this.error_html = errorMessage;
    } finally {
      this.loading = false;
    }
    }

  }
};
</script>

<style scoped>
.error-list {
  list-style-type: disc;
  padding-left: 20px;
  color: #e53935;
  font-size: 0.9rem;
}

.error-text {
  color: #e53935;
  font-weight: 500;
}

.document-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
  background: #fff;
}

.document-table th,
.document-table td {
  padding: 0.7em;
  border: 1px solid #e3e3e3;
  text-align: left;
}

.upload-label {
  display: inline-block;
  cursor: pointer;
  color: #92d4cb;
  vertical-align: middle;
}

.file-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.file-icon {
  color: #92d4cb;
  font-size: 24px;
}

.remove-button {
  margin-left: 5px;
}
/* In your <style scoped> section */
.marked-for-deletion {
  background-color: #fff5f5; /* A light red background */
  text-decoration: line-through;
  opacity: 0.6;
}

/* Optional: Disable inputs in the deleted row */
.marked-for-deletion select,
.marked-for-deletion textarea,
.marked-for-deletion input {
  pointer-events: none;
  background-color: #e9ecef;
}


.add-row {
  font-size: 24px;
  vertical-align: middle;
}

/* Basic Button */
.submit-button {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background-color: #92d4cb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.form-select {
  width: 150px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
</style>
