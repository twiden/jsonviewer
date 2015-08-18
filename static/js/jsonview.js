function json_tree(container, dataset) {
    var data = [{'text': '<strong>Root</strong>'}]

    function is_instance(item, type) {
      return Object.prototype.toString.call(item) === '[object ' + type + ']'
    }

    function format_key(key) {
      return '<strong>' + key + '</strong>';
    }

    function default_parameter(value, fallback) {
        return typeof value !== 'undefined' ? value : fallback;
    }

    function walk(parent, subtree, is_list) {
      is_list = default_parameter(is_list, false)
      var items = [];
      for (var key in subtree) {
        if (subtree.hasOwnProperty(key)) {
          if (is_instance(subtree[key], 'Object')) {
            var node = {'text': format_key(key)}
            items.push(walk(node, subtree[key]))
          }
          else if (is_instance(subtree[key], 'Array')) {
            var node = {'text': format_key(key)}
            items.push(walk(node, subtree[key], true))
          }
          else {
            items.push(
                {'text': (is_list ? '' : format_key(key) + ': ') + subtree[key]})
          }
        }
      }
      if (!is_list) {
          items.sort(function (a, b) {
              if (a.hasOwnProperty('nodes') != b.hasOwnProperty('nodes')) {
                  return a.hasOwnProperty('nodes') ? -1 : 1;
              }
              return a['text'] > b['text']
          });
      }
      parent['nodes'] = items;
      parent['tags'] = [items.length + ' sub items'];
      return parent;
    }

    walk(data[0], dataset);

    var options = {
      showTags: true,
      levels: 2,
      data: data
    };
   container.treeview(options)
}

$( "#json-submit" ).click(function() {
	var json = {};
	try {
        json = JSON.parse($('#json-textarea').val());
    } 
    catch(e) {
        alert('Not valid JSON'); //error in the above string(in this case,yes)!
    }
    json_tree($("#treeview"), json)
});