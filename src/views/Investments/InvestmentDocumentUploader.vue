<!-- InvestmentDocumentUploader.vue -->
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
    <div class="button-row d-flex mt-4"  v-if="is_allowed('investments','update')">

      <material-button type="submit" color="dark" variant="gradient" class="ms-auto mb-0 js-btn-next" full-width>
        <span v-if="loading == false">Upload Documents</span>
        <PulseLoader v-if="loading" text="Saving" />
      </material-button>




    </div>

  </form>
</template>

<script>
import docTypesData from '@/assets/investment_doc_types.json';
import MaterialButton from "@/components/MaterialButton.vue";
import { storeInvestmentDocuments, fetchInvestmentById } from "@/utils/investment_services";
import PulseLoader from "../PulseLoader.vue";
import showSwal from "@/mixins/showSwal.js";
import { is_allowed } from "@/utils/api_services"; 

export default {
  name: "InvestmentDocumentUploader",
  components: {
    MaterialButton,
    PulseLoader
  },
  props: {
    investmentId: {
      type: Number,
      required: true
    }
  },
  watch: {
    investmentId: {
      // This handler will now run immediately when the component is mounted
      handler(newId) {
        if (newId) {
          this.loadDocumentsForInvestment(newId);
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
    if (!this.investmentId) {
      // If creating a new investment, start with one empty row
      this.addDocumentRow();
    }

  },
  methods: {
    is_allowed,
    async loadDocumentsForInvestment(investmentId) {
      try {
        const response = await fetchInvestmentById(investmentId);
        const existingDocs = response.data.data.investment_docs;
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
      this.error_html = "";
      
      try {
        const formData = new FormData();

        // 1. Find documents that are truly new (have a file, but no database ID)
        const newDocuments = this.documentRows.filter(doc => !doc.db_id && doc.file);

        // 2. Find existing documents that have been marked for deletion
        const deletedDocumentIds = this.documentRows
            .filter(doc => doc.db_id && doc._deleted)
            .map(doc => doc.db_id);

        // 3. Find existing documents that are NOT marked for deletion (these are candidates for update)
        const updatedDocuments = this.documentRows.filter(doc => doc.db_id && !doc._deleted);

        // 4. Append the arrays to formData with the keys the controller expects
        newDocuments.forEach((doc, index) => {
            if (!doc.doc_type) throw new Error(`Document type is required for new file: ${doc.file.name}`);
            formData.append(`documents[new][${index}][file]`, doc.file);
            formData.append(`documents[new][${index}][type]`, doc.doc_type);
            formData.append(`documents[new][${index}][notes]`, doc.notes || '');
        });

        updatedDocuments.forEach((doc, index) => {
            if (!doc.doc_type) throw new Error(`Document type is required.`);
            formData.append(`documents[updated][${index}][id]`, doc.db_id);
            formData.append(`documents[updated][${index}][type]`, doc.doc_type);
            formData.append(`documents[updated][${index}][notes]`, doc.notes || '');
            // Append a file only if a new one was selected to replace the old one
            if (doc.file) {
                formData.append(`documents[updated][${index}][file]`, doc.file);
            }
        });
        
        deletedDocumentIds.forEach((id, index) => {
            formData.append(`documents[deleted][${index}]`, id);
        });
        
        // Check if there is anything to submit
        if (newDocuments.length === 0 && updatedDocuments.length === 0 && deletedDocumentIds.length === 0) {
             showSwal.methods.showSwal({ type: "info", message: "No changes to save." });
             this.loading = false;
             return;
        }
        
        // 5. Make the API call
        if (this.investmentId) {
          await storeInvestmentDocuments(formData, this.investmentId);
          showSwal.methods.showSwal({ type: "success", message: "Documents saved successfully!" });
          this.loadDocumentsForInvestment(this.investmentId); // Reload the list to get a fresh state
        } else {
          throw new Error("Investment ID is missing");
        }

      } catch (error) {
        console.error("Save error:", error);
        let errorMessage = "An error occurred.";
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage = error.response.data.message;
        } else {
            errorMessage = error.message;
        }
        this.error_html = `<div style='color:red'>${errorMessage}</div>`;
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
