<template>
  
  <div class="investor-documents-container">
    <div class="documents-table">
      <!-- Table Header -->
      <div class="documents-table-header">
        <div class="header-item">Serial No.</div>
        <div class="header-item">Document Type</div>
        <div class="header-item">Upload</div>
      </div>

      <!-- Table Body -->
      <div class="documents-table-body">
        <div v-for="(doc, index) in documents" :key="doc.id" class="document-row">
          <div class="row-item serial-no">{{ index + 1 }}</div>
          <div class="row-item">
            <select v-model="doc.type" class="form-select">
              <option disabled value="">Select a document</option>
              <option v-for="docType in docTypes" :key="docType.id" :value="docType.name">
                {{ docType.name }}
              </option>
            </select>
          </div>
          <div class="row-item upload-section">
            <label :for="'file-upload-' + doc.id" class="upload-button">
              <i class="material-icons">cloud_upload</i>
              
            </label>
            <input
              :id="'file-upload-' + doc.id"
              type="file"
              @change="handleFileUpload($event, doc.id)"
              class="file-input"
            />
            <div v-if="doc.preview" class="preview-container">
              <i class="material-icons" style="width:20px;height: 20px;margin:10px">insert_drive_file</i>
              <button @click="removeFile(doc.id)" class="remove-button">×</button>
            </div>
          </div>
          <div class="row-item" >
            <textarea 
    placeholder="Notes" 
    style="width: 100%; padding: 10px; font-size: 14px; border: 1px solid #ccc; border-radius: 6px; resize: vertical;"
    rows="2"
    v-model="doc.notes"
  ></textarea>
          </div>
          <div class="row-item add-button-container" v-if="index === documents.length - 1">
            <button @click="addRow" class="add-row-button">
              <i class="material-icons">add</i>
              
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Import the JSON data at the top level of the script
import docTypesData from '@/assets/doc_types.json';

export default {
  name: 'InvestorDocuments',
  
  // 1. All reactive state goes into the data() function
  data() {
    return {
      documents: [
        { id: 1, type: '', file: null, preview: null, notes: null }
      ],
      docTypes: []
    };
  },
  
  // 2. Code that runs on component creation goes into the mounted() hook
  mounted() {
    this.docTypes = docTypesData;
  },

  // 3. All functions become methods
  methods: {
    // Adds a new row to the table
    addRow() {
      // Use 'this.documents' instead of 'documents.value'
      const newId = this.documents.length > 0 ? Math.max(...this.documents.map(d => d.id)) + 1 : 1;
      this.documents.push({
        id: newId,
        type: '',
        file: null,
        preview: null,
        notes : null
      });
    },

    // Handles the file upload for a specific row
    handleFileUpload(event, docId) {
      const file = event.target.files[0];
      if (file) {
        const doc = this.documents.find(d => d.id === docId);
        if (doc) {
          doc.file = file;
          doc.preview = URL.createObjectURL(file);
        }
      }
    },

    // Removes the file from a specific row
    removeFile(docId) {
      const doc = this.documents.find(d => d.id === docId);
      if (doc) {
        doc.file = null;
        doc.preview = null;
        doc.notes = null;
        // Reset the file input to allow re-uploading the same file
        const fileInput = document.getElementById(`file-upload-${docId}`);
        if (fileInput) {
          fileInput.value = '';
        }
      }
    },

    // 4. This method is automatically public and can be called by the parent component
    getDocuments() {
      // Filter out incomplete rows and return the clean data
      return this.documents
        .filter(doc => doc.type && doc.file)
        .map(doc => {
          return {
            type: doc.type,
            file: doc.file,
            notes : doc.notes
          };
        });
    }
  }
};
</script>

<style scoped>
/* Styles remain the same and are fully compatible */
.investor-documents-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}
.documents-table {
  width: 100%;
  border-collapse: collapse;
}
.documents-table-header {
  display: flex;
  background-color: #f1f1f1;
  border-bottom: 2px solid #ddd;
  font-weight: bold;
}
.header-item {
  padding: 12px;
  flex: 1;
  text-align: left;
}
.documents-table-body {
  display: flex;
  flex-direction: column;
}
.document-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
}
.row-item {
  padding: 12px;
  flex: 1;
}
.serial-no {
  font-weight: bold;
  color: #555;
  flex: 0 0 80px;
}
.form-select {
  width: 150px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
}
.upload-section {
  display: flex;
  align-items: center;
  gap: 15px;
}
.upload-button {
  display: inline-flex;
  align-items: center;
  padding: 8px 15px;
  background-color: #ccc;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  gap: 8px;
  transition: background-color 0.3s;
}
.upload-button:hover {
  background-color: #0056b3;
}
.file-input {
  display: none;
}
.preview-container {
  position: relative;
}
.remove-button {
  position: absolute;
  top: -5px;
  right: -5px;
  background: red;
  color: white;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.add-button-container {
  flex: 0 0 100px;
}
.add-row-button {
  display: inline-flex;
  align-items: center;
  padding: 8px 8px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  gap: 8px;
  transition: background-color 0.3s;
}
.add-row-button:hover {
  background-color: #218838;
}
</style>