/**
 * Simple select tag filtering based on regexp.
 */
function filterlist(selectobj) {

  this.selectobj = selectobj;

  this.reset = function() {
    this.set('');
  }

  this.set = function(pattern) {

    var index=0, regexp, e;
    var groups = this.selectobj.getElementsByTagName("optgroup");

    if (!this.selectobj) return;
    if (!this.selectobj.options) return;

    try {
      regexp = new RegExp(pattern, 'i');
    } catch(e) {
      return;
    }

    for (var i=0; i < groups.length; i++) {

      var group = groups[i];
      var options = group.getElementsByTagName("option");

      // If no match is found then the group is hidden.
      group.className = "hidden";
      for(var j = 0; j < options.length; j++) {
        var option = options[j];
        var dir    = option.getAttribute("data-dir");
        var file   = option.value;

        option.className = "hidden";
        // If a single match is found the whole group is displayed.
        if (regexp.test(dir)) {
          group.className = "";
          option.className = "";
        }
        if (regexp.test(file)) {
          option.className = "";
          group.className = "";
        }

      }
    }

  }

}
