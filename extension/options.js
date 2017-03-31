// Saves options to chrome.storage.sync.
function save_options() {
  var schema = document.getElementById('schema').value;
  chrome.storage.sync.set({
    schema: schema,
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get({
    schema: 'filename',
  }, function(items) {
    document.getElementById('schema').value = items.schema;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
